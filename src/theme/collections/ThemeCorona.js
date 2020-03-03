// theme/collections/ThemeCorona.js

import {
    red, green, blue, yellow,
    amber, orange, deepOrange, purple,
    indigo, blueGrey, grey, teal, cyan,
    lightBlue, deepPurple, pink,
} from '@material-ui/core/colors';

const ThemeCorona = {
    palette: {
        type: 'light',
        // Essential
        primary: deepPurple,
        secondary: purple,
        error: red,
        // Optional
        sample: {
            // light: will be calculated from palette.sample,
            main: amber[500],
            // dark: will be calculated from palette.sample,
            // contrastText: will be calculated to contrast with palette.sample
        },
    },
    colors: {
        // Base colors
        colorLight: '#ffffff',
        colorDark: grey[800],
        // Content
        contentBackground: grey[50],
        contentText: grey[800],
        // AppBar
        appBarContentText: '#ffffff',
        // Drawer menu
        drawerMenuCategoryText: grey[500],
        drawerMenuSelectedBackground: deepPurple[100],
        drawerMenuSelectedPin: deepPurple[500],
        // Speed dial
        speedDialColor: deepPurple[500],
        // Progress
        progress: deepPurple[500],
        // Color set for StickyBoard components (e.g., charts, number...)
        colorArray: [
            deepPurple[500],
            pink[500],
            teal[500],
            deepPurple[700],
            pink[700],
            teal[700],
            deepPurple[300],
            pink[300],
            teal[300],
            deepPurple[900],
            pink[900],
            teal[900],
        ],
    },
    overrides: {
        MuiAppBar: {
            colorPrimary: {
                backgroundColor: purple[900],      // AppBar background color
                color: '#ffffff',
            },
        },
        MuiDrawer: {
            paper: {
                backgroundColor: grey[300],     // Drawer background color
            }
        },
        MuiIconButton: {
            root: {
                color: '#ffffff',
            }
        },
        MuiFab: {
            primary: {
                backgroundColor: deepPurple[500],
                color: grey[200],
                '&:hover': {
                    backgroundColor: deepPurple[700],
                }
            }
        },
        MuiSpeedDialAction:{
            fab: {
                backgroundColor: grey[800],
                color: '#ffffff',
            }
        }
    },
};

export default ThemeCorona;
