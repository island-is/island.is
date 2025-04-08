#!/bin/bash

# Function to open a new iTerm tab with a specific command
open_iterm_tab() {
    local dir="/Users/thorhildurthorleiksdottir/Home/Projects/island.is"
    local cmd="$1"
    
    osascript -e "
    tell application \"iTerm\"
        if (count of windows) = 0 then
            create window with default profile
        end if
        tell current window
            create tab with default profile
            tell current session
                write text \"cd '$dir'; $cmd\"
            end tell
        end tell
    end tell"
}

# Replace these with your specific directories and commands
open_iterm_tab "yarn start judicial-system-backend"
open_iterm_tab "yarn start judicial-system-api"
open_iterm_tab "yarn start judicial-system-web"
open_iterm_tab "yarn start judicial-system-message-handler"