# Overview
This is not a tool you can download and run, rather, it's a showcase of the UI work I've done in the past.

You _can_, however, read through the .js I've written and take portions our.
e.g. The snapping logic is intersting in panel-array-class.js
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

1. Google Maps Address Lookup API integration
![address-lookup](https://github.com/user-attachments/assets/e06ccdc1-b1dd-4292-b9c7-659219458c0f)

2. 
3. 
