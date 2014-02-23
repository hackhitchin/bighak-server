/**
 * Created by robberwick on 08/02/14.
 */
define(["jquery", '../../'], function ($, _) {

        var mod = function () {

            var opts = {
                max_steps: 16,
                $keypad: $('#keypad')
            };

            var ACTION_MAP = {
                up: {
                    verb:"forward",
                    max: 99
                },
                down: {
                    verb:"reverse",
                    max: 99
                },
                left: {
                    verb:"left",
                    max: 99
                },
                right: {
                    verb:"right",
                    max: 99
                },
                pause: {
                    verb:"pause",
                    max: 99
                },
                pewpew: {
                    verb:"fire",
                    max: 9
                }
            }

            // Get references to buttons
            var instructionArray = [], // array of step objects
                $numbers = opts.$keypad.find(".num"), // subset of buttons
                $arrows = opts.$keypad.find(".arrow"), // arrow buttons
                $pewpew = opts.$keypad.find("#pewpew"), // fricking laser
                $pause = opts.$keypad.find("#pause"), // Pause
                $clearmemory = opts.$keypad.find("#cm"), // CM button
                $clearentry = opts.$keypad.find("#ce"), // CE button
                $repeat = opts.$keypad.find('#x2'), // repeat button
                $test = opts.$keypad.find('#test'), // test button
                $tick = opts.$keypad.find("#tick"), // tick button
                $go = opts.$keypad.find("#go"), // go button
                $out = opts.$keypad.find("#out"), // out button - not used
                $actionbuttons = $arrows.add($pewpew)
                    .add($repeat)
                    .add($pause);

            var currentInstruction = null;

            function init() {

                // dump instructionArray
                dumpMemory();

                /*
                 these buttons are always valid
                 */

                // clear last entry
                $clearentry.on('click', clearentry);

                // clear memory
                $clearmemory.on('click', dumpMemory);

                // send data
                $go.on("click", sendData);

                // initialise the action buttons
                $actionbuttons.on('click', function (e) {
                    setInstructionAction(ACTION_MAP[$(this).attr('id')].verb);
                });

                //initialise the number buttons
                $numbers.on('click', function (e) {
                    var val = parseInt($(this).attr('id').substring(3), 10);

                    setInstructionValue(val);
                });

            }

            function createBlankInstruction() {

                // create a new, blank object
                instructionArray.push({
                    action: null,
                    value: 0
                });

                // update currentInstruction to point to it
                currentInstruction = instructionArray[instructionArray.length - 1];

            }

            function setInstructionAction(action) {

                // If our current instruction already had an action and value
                // then we'll treat this as a new instruction

                if (currentInstruction.action && currentInstruction.value > 0) {
                    createBlankInstruction();
                }

                console.log("setting current instruction to:" + action);
                // if the current instruction doesn't have an action yet, then set it
                if (!currentInstruction.action) {
                    currentInstruction.action = action;
                } else {
                    console.log("already have an action:", currentInstruction.action);
                }
            }

            function setInstructionValue(val) {

                if (!currentInstruction.action) {
                    console.log("Cannot set numeric value - no action defined yet");
                    return
                }

                // if we already have a value, multiply it by 10
                if (currentInstruction.value > 0) {
                    currentInstruction.value = (currentInstruction.value * 10)
                }

                // increment instruction value
                currentInstruction.value += val;

                // validate action value
                validateInstructionValue();

                console.log("current instruction value:", currentInstruction.value);

            }

            function validateInstructionValue(){
                var action = _.where(ACTION_MAP, {verb: currentInstruction.action})[0];
                currentInstruction.value = (currentInstruction.value > action.max) ? action.max : currentInstruction.value;
            }

            function dumpMemory() {

                // clear instructionArray
                instructionArray = [];

                // create a new blank instruction
                createBlankInstruction()
            }

            function clearentry() {
                console.log("Clearing last entry…");
                instructionArray.pop();

                //create a new blank instruction
                createBlankInstruction();

                console.log("instructionArray", instructionArray)
            }

            function canCreateInstruction() {
                return instructionArray.length < (opts.max_steps);
            }

            function sendData() {
                // send step list to the server
                console.log("Sending data to the server");
                $.ajax({
                    url: "/send",
                    data: {
                        instructions: JSON.stringify(instructionArray)
                    },
                    type: 'POST',
                    dataType: 'JSON',
                    traditional: true
                }).done(function(data){
                    console.log("Instructions submitted successfully: ", data)
                }).fail(function(jqXHR, textStatus, statusCode){
                    console.log("Could not send instructions: ", textStatus)
                })
            }

            return {
                init: init
            }

        };

        return mod;


    }
);