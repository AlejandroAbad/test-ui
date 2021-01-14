import React, { useCallback, useContext } from 'react';
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import MenuSuperior from 'navegacion/MenuSuperior';
import DrawerLateral from 'navegacion/DrawerLateral';
import Pantalla from 'pantallas/Pantalla';

import { ContextoAplicacion } from 'contexto';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: 0,
    marginTop: theme.spacing(10),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })
  }
}));

export default function App() {

  const classes = useStyles();
  const [drawerOpen, _setDrawerOpen] = React.useState(false);

  const { jwt } = useContext(ContextoAplicacion);


  const handleDrawerSwitch = useCallback((flag) => {
    if (flag === undefined)
      _setDrawerOpen(!drawerOpen);
    else
      _setDrawerOpen(flag ? true : false);
  }, [drawerOpen, _setDrawerOpen]);


  return (
    <Router>
      <div className={classes.root}>

        <CssBaseline />

        <MenuSuperior onMenuClicked={handleDrawerSwitch} />
        <DrawerLateral open={drawerOpen} onClose={() => handleDrawerSwitch(false)} onOpen={() => handleDrawerSwitch(true)} />

        <main className={classes.content}>
            {!jwt ? <Pantalla.Login /> :

              <Switch>
                <Route path="/usuario" render={(props) => <Pantalla.Usuario {...props} />} />
                <Route path="/utilidades/visorTramasFedicom2" render={(props) => <Pantalla.VisorTramasFedicom2 {...props} />} />
                <Route path="/" render={(props) => <Pantalla.Principal {...props} />} />
              </Switch>

            }

          </main>

      </div>
    </Router>
  );
}
