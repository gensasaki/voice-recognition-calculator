/*
 * Copyright 2016 Sony Corporation
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions, and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

/**
 * The callback to prepare a segment for play.
 * @param  {string} trigger The trigger type of a segment.
 * @param  {object} args    The input arguments.
 */
var convertingWords = [operators, numbers];

da.segment.onpreprocess = function (trigger, args) {
    console.log('onpreprocess', { trigger: trigger, args: args });
    da.startSegment(null, null);
};

da.segment.onstart = function (trigger, args) {
    console.log('onstart', { trigger: trigger, args: args });
    var speechObj;
    var speechStr;

    // Get launch voice input from arguments
    if (args !== undefined && args.recognitionSetString !== undefined) {
        speechObj = JSON.parse(args.recognitionSetString);
        speechStr = speechObj.SemanticAnalysisResults[0].SpeechRecogResult;
        var convertedSpeechStr = textConvert(speechStr);
        var answer = String(eval(convertedSpeechStr));
        var synthesis = da.SpeechSynthesis.getInstance();
        synthesis.speak('The answer is ' + answer, {
            onstart: function () {
                console.log('speak start');
            },
            onend: function () {
                console.log('speak onend');
                da.stopSegment();
            },
            onerror: function (error) {
                console.log('speak cancel: ' + error.messsage);
                da.stopSegment();
            }
        });
    }

    function textConvert(speechStr) {
        convertingWords.forEach(function(convertingHash) {
            for (var strKey in convertingHash) {
                speechStr = speechStr.replace(new RegExp(strKey, 'g'), convertingHash[strKey]);
            }
        });
        return speechStr;
    }
};
