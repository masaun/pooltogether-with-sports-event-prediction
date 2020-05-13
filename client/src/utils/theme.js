import green from '@material-ui/core/colors/green';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      dark: blueGrey[900],
      light: blueGrey[600],
      main: blueGrey[800],
    },
    secondary: {
      dark: green[900],
      light: green[500],
      main: green[800],
    },
  },
});
