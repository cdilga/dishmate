Here’s my recipe. I spin up around 5 Gemini-cli instances in the same project and start them all out with this prompt:

First read ALL of the AGENTS .md file and README .md file super carefully and understand ALL of both! Then use your code investigation agent mode to fully understand the code, and technical architecture and purpose of the project.

—-

Then I queue up this one:

I want you to sort of randomly explore the code files in this project, choosing code files to deeply investigate and understand and trace their functionality and execution flows through the related code files which they import or which they are imported by. Once you understand the purpose of the code in the larger context of the workflows, I want you to do a super careful, methodical, and critical check with "fresh eyes" to find any obvious bugs, problems, errors, issues, silly mistakes, etc. and then systematically and meticulously and intelligently correct them. Be sure to comply with ALL rules in AGENTS .md and ensure that any code you write or revise conforms to the best practices referenced in the AGENTS .md file.

—-

Then when that all finishes I also do this:

Ok can you now turn your attention to reviewing the code written by your fellow agents and checking for any issues, bugs, errors, problems, inefficiencies, security problems, reliability issues, etc. and carefully diagnose their underlying root causes using first-principle analysis and then fix or revise them if necessary? Don't restrict yourself to the latest commits, cast a wider net and go super deep!

—-

Then I kill them and start new ones with the same recipe. Keep doing that round after round of that until they come up clean!
