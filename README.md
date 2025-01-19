# Overview
This is not a tool you can download and run, rather, it's a showcase of the UI work I've done in the past.

You _can_, however, read through the .js I've written and take portions out.
e.g. The snapping logic is interesting in [panel-array-class.js](class/item/panel-array-class.js)

        //
        // Snapping
        //
        
        //  A parallel panels snapping diagram

        //  Snap points holds the first item's points, last item's points, and every panels basic points
        //
        //  First points will have the left 3 points of an array
        //  Basic points will have the top and bottom points for every single array
        //  End points will have the right 3 points of an array
        //
        //  It's fine for one panel to be the first, last, and basic panel at the same time.

        //  Each panel (labeled as 'Self') stores snapping points around itself
        //
        //     L1        T1      T2       R1
        //
        //           -------- -------- --------
        //          |        |        | Random |
        //          |        |        | Panel  |
        //     L2   |  Self  |  Self  |   R2   |
        //          |        |        |        |
        //          |        |        |        |
        //           -------- -------- --------
        //          | Random |
        //     L3   |   B1   |   B2       R3
        //          | Panel  |

        //  In this example, L1-3 are the Left points extends from the Left most panel labeled 'Self
        //  T1-2 and B-2 are the 'Basic' top and bottom points
        //  R1-3 are the Right points extending from the last panel in the array

# Showcase

1. [Google Maps Address Lookup API integration](panelizer-google-maps.js)
![address-lookup](https://github.com/user-attachments/assets/e06ccdc1-b1dd-4292-b9c7-659219458c0f)

2. [Solar Panels within a '_Solar Array_' which is snappable, moveable, expandable, .. you get the idea](class/item/panel-array-class.js)
![overview](https://github.com/user-attachments/assets/bd755794-736b-477d-aae7-f095567ae235)

3. [Control all Items with '_Tap Tools_'](panelizer-tap-tools.js)
![touch-tools](https://github.com/user-attachments/assets/d0d882ac-a3d1-43c7-a78e-17ac092ace65)

4. [Snapping is pretty cool, and I did some tricky things. It was a lot of trigonometry, I totally paid attention in school and didn't have to teach myself again on the fly](class/item/panel-array-class.js)
![tricky-snapping](https://github.com/user-attachments/assets/20456dbd-2ba4-4ae9-8ffc-20e2617a70b2)

5. [All good projects need a save function. I got that](panelizer-save.js) [Also, you gotta load it](class/general/post-load-action.js)
![save-to-file](https://github.com/user-attachments/assets/dd8a7066-b22b-4e38-84bb-accdb3280f75)

6. [The UI is controlled by JS too, see the JS in class/gui/*](class/gui)
![rotation](https://github.com/user-attachments/assets/e3609dcd-8398-4d6c-970b-06f3509d2956)


Here are some more GIFs:
![meter-tool](https://github.com/user-attachments/assets/5c1c6f2f-3f56-4c09-b7f1-0404b5765311)
![obstacle-tool](https://github.com/user-attachments/assets/284005af-42b9-4089-bbed-a0fea9b337b6)
![sideways-panels](https://github.com/user-attachments/assets/afe11f6c-78ff-4c57-baf0-d5294aa27e1c)
![snapping](https://github.com/user-attachments/assets/0ebb3263-e773-44a6-9e65-d781be9c6660)
![text-tool](https://github.com/user-attachments/assets/88162ae8-6a82-461f-add6-1d73cec23951)

Finally, I wanted to show most of the project was in JS, without actually sharing the source:
![GitHub](https://github.com/user-attachments/assets/d47f3079-f705-4367-b23a-624d05461fa7)


Yes, I made it all myself. The other person on the repo is the person I delivered the content to.



