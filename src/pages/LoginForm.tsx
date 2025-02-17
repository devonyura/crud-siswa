import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonPage, IonTitle, IonToolbar, IonImg, IonInputPasswordToggle, IonSegment } from '@ionic/react';
// import './LoginForm.css';

const LoginForm: React.FC = () => {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Data Siswa APP</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
        <IonImg src="/icon.png" className="app-logo" alt="App Logo" />
				<IonSegment className="login-container">
					<IonItem>
            <IonInput label="Username" placeholder="Masukkan Username"></IonInput>
					</IonItem>
					<IonItem>
            <IonInput type="password" label="Password" value="">
            <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
          </IonInput>
					</IonItem>
					<IonButton expand="full" className="login-button">Login</IonButton>
				</IonSegment>
			</IonContent>
		</IonPage>
	);
};

export default LoginForm;
