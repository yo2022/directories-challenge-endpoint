# how to run the app: (assuming node.js is installed with version found on .nvmrc file)

navigate to root directory of the project and run: 'node app'. The app should run and start cli expecting your first command to be entered

# how to run the tests: (assuming npm is installed)

'jest' package is required to run the tests.
navigate to root directory of the project and run: 'npm install', followed by 'npm test'.

# design considerations:

1. separation of concerns - I made effort that each component would do 'one thing' allowing potential reuse and extendability.
2. error handling - file-service.js handle almost all the logic, and as such it won't handle errors by design. It would catch some errors to produce more specific errors. The app would handle potential errors by logging them to the console (enough for this project, but not for production of course).
   addionally, call stack / inner exception isn't passed on the custom errors (should be on prod env).
3. directory object - since Javascript object is a collection of key-value pairs, I chose not to create additional class to represent a 'directory', which would be the case if I was to use different programming language.
4. input validation - for this project there's a limited input validation considering the expected time. Validation include the number of passed arguments and that those are not undefined. Validation can be improved to cover special characters check etc
5. import path - since it's a small project I used relative path import. For a larger project, absolute import would be preferred.
6. cli prompt - for this project, the cli won't print any message to the user (not very intuitive) in order to suppor the strict requirements for the expected output.
7. tests - test coverage is basic with testing basic functionality of 'CREATE', 'MOVE', and 'DELETE' commands. It can be improved by adding support for testing the App file, the CLI functionality and more.

# other notes:

1. project was tested on windows machine. It should work on other machines running nodejs but it was not tested on other OS.
2. 'move' command currently doesn't support moving to root directory. It's easy to implement but convention is requried for the desired way to designate such intention.
