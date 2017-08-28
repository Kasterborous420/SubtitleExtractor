/*
    Function Name: ReadKeyFramedSubs
    Author: Wayne Lee [nypgdt14waynelee@gmail.com]
    Brief: Reads the text layer and exports the text data to a .txt file
    */
function ReadKeyFramedSubs(){
    var _time = 0;                                                                      // float variable "_time" to handle, well, time.
    var subtitleLayer = app.project.activeItem.selectedLayers[0];   // Layer variable (if this has an error select the layer to export before running the file)
    var currentSub = "";                                                             // Current Subtitle property
    var previousSub = "";                                                                  // Previous Subtitle text for checking with the current subtitle
    var keyframeStart = 0, keyframeEnd = 0;                                           // keyframe start times and end times
    var numSubs = 0;                                                                // number of subtitles
    var prevNumSubs = 0;
    var written = false;

    /*
        Creates a save file to save the subtitles to.
        Change parameters "Save the text file" to whatever you want the dialogue window to display.
        Change parameters ".txt" to whatever file extension you want it to.
        Change parameters "TEXT text" to edit how the filetype and extensions are displayed on File Explorer
        */
    var saveFile = File.saveDialog("Save the srt file.", ".srt ", "TEXT text");

    // Where the magic happens
    if(subtitleLayer.property("sourceText") != null){

         // Open text file
         saveFile.open("w", "TEXT", "????");

            // Get a handle on the text data on the layer
            var textSource = subtitleLayer.property("sourceText");

            // Magic
            while(_time <= subtitleLayer.outPoint){

                // Get the current subtitle being displayed at timestamp "_time",
                // and because we do not have an associated expression for it we set preExpression to "false"
                currentSub = textSource.valueAtTime(_time, false);
                if(currentSub.text != previousSub){
                   //Determine if it is a start or the end
                  if(currentSub.text != ""){
                    if(previousSub == ""){
                       //Start new
                      keyframeStart = _time;
                      previousSub = currentSub.text;
                      numSubs++;
                      written = false;
                    } else{
                      //End the keyframe, write it and then start a new one
                      keyframeEnd = _time;
                      saveFile.writeln(numSubs);
                      saveFile.writeln(Convert(keyframeStart) + " --> " + Convert(keyframeEnd));
                      saveFile.writeln(previousSub);
                      saveFile.write("\n");
                      prevNumSubs++;
                      written = true;

                      //Start new keyframe
                      keyframeStart = _time;
                      previousSub = currentSub.text;
                      numSubs++;
                      written = false;
                      //break;
                    }
                  } else{
                    //End the keyframe
                    keyframeEnd = _time;
                    saveFile.writeln(numSubs);
                    saveFile.writeln(Convert(keyframeStart) + " --> " + Convert(keyframeEnd));
                    saveFile.writeln(previousSub);
                    saveFile.write("\n");
                    prevNumSubs++;
                    written = true;

                    //Start new keyframe
                    keyframeStart = _time;
                    previousSub = currentSub.text;
                    numSubs++;
                    written = false;
                    //break;
                  }
                }
              // Increment  time by 1/30ths of a second cuz the composition is at 30fps
              if(_time == subtitleLayer.outPoint)
              {
                keyframeEnd = _time;
                saveFile.writeln(numSubs);
                saveFile.writeln(Convert(keyframeStart) + " --> " + Convert(keyframeEnd));
                saveFile.writeln(previousSub);
                saveFile.write("\n");
                prevNumSubs++;
                written = true;
              }
             _time += 1/30;
            }

         // Close file when done
         saveFile.close();
        }
}
function Convert(t){
        var seconds = Math.floor(t);
        var remainder = t - seconds;
        remainder *= 1000;
        remainder = Math.floor(remainder);
        var minutes = seconds/60;
        minutes = Math.floor(minutes);

        seconds = seconds - (minutes*60);

        var SRTime = "00:"; // ik best pun ever
        if(minutes < 10){
                SRTime = SRTime + "0" + minutes +":";
            }
        else{
            SRTime = SRTime + minutes + ":";
            }

        if(seconds < 10){
            SRTime = SRTime + "0" + seconds + ",";
            }
        else{
            SRTime = SRTime + seconds +",";
            }

        if(remainder < 10){
            SRTime = SRTime + "00" + remainder;
            }
        else if(remainder < 100){
            SRTime = SRTime + "0" + remainder;
            }
        else{
            SRTime = SRTime + remainder;
            }

        return SRTime;
}
// Run the damn thing
ReadKeyFramedSubs();
