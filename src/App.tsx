import { Redirect, Route } from 'react-router-dom'
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router'
import { images, square, triangle, person } from 'ionicons/icons'
import StudentList from './pages/StudentList'
import Tab2 from './pages/Tab2'
import Tab3 from './pages/Tab3'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css'

/* Theme variables */
import './theme/variables.css'

setupIonicReact();

const basePath = "/crud-siswa"

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter basename={basePath}>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path={`${basePath}/student-list`}>
            <StudentList />
          </Route>
          <Route exact path={`${basePath}/tab2`}>
            <Tab2 />
          </Route>
          <Route path={`${basePath}/tab3`}>
            <Tab3 />
          </Route>
          <Route exact path={basePath}>
            <Redirect to={`${basePath}/student-list`} />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="student-list" href={`${basePath}/student-list`}>
            <IonIcon aria-hidden="true" icon={person} />
            <IonLabel>Siswa</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href={`${basePath}/tab2`}>
            <IonIcon aria-hidden="true" icon={images} />
            <IonLabel>Gallerys</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href={`${basePath}/tab3`}>
            <IonIcon aria-hidden="true" icon={square} />
            <IonLabel>Tab 3</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
