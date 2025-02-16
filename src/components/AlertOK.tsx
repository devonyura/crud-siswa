
import {IonAlert} from '@ionic/react';


interface AlertOkProps {
  isOpen: boolean;
  onDidDismiss: () => (void);
  header: string | undefined;
}

const AlertOK:React.FC<AlertOkProps> = ({ isOpen, onDidDismiss, header }) => {

  return (
    <IonAlert
      isOpen={isOpen}
      onDidDismiss={() => onDidDismiss()}
      header={header}
      buttons={['OK']}
    />
  );
}

export default AlertOK;