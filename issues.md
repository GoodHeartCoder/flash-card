add some text editing to my card editor
i think i can make the studySession form better

when the user has some cards that are reschedule in the same session i need to give him a warnning before he lives telling him that these cards will reset.
exiting the session can happen in many ways but there is one way that i can't prevent unless i use the new data router approach with useBlocker Hook.

if a user start studying an empty deck or deck that has cards but with newCardsCounter and dueCardsCounter set 0 in spaced mode the end Session message should appear

i need to give the user a way to limit how many new cards there can be and due cards but i think that will add more complexity
