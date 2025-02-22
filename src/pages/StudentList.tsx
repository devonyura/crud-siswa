import { useEffect, useState } from 'react'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonProgressBar,
  IonAlert,
  IonText,
  IonFab,
  IonFabButton,
  useIonViewWillEnter
} from '@ionic/react';
import { pencil, trash, add } from "ionicons/icons"
import './StudentList.css'
import { getAllData, deleteData, Student } from '../hooks/restAPIRequest'
import AlertOK from '../components/AlertOK'
import { useHistory } from 'react-router-dom'
// import { useStudent, StudentProvider } from '../context/StudentContext'



const StudentList: React.FC = () => {

  const history = useHistory();
  // const { updated, setUpdated } = useStudent();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showOkAlert, setShowOkAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isRefresh, setIsRefresh] = useState(true);

  const fetchStudents = async () => {
    setLoading(true)

    await getAllData(setStudents)

    setLoading(false)
  }

  useEffect(() => {
    if (!isRefresh) {
      fetchStudents()
      setIsRefresh(false);
    }
  }, []);

  useIonViewWillEnter(() => {
    setIsRefresh(true);
    fetchStudents()
  })


  const handleDelete = async () => {
    if (selectedId) {
      const result = await deleteData(selectedId)

      if (result.success) {
        setShowOkAlert(true)
        setAlertMessage("siswa berhasil dihapus!")

        getAllData(setStudents)
      } else {
        setShowOkAlert(true)
        setAlertMessage("siswa gagak dihapus!" + result.error)
      }
    }
    setSelectedId(null);
  }



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Daftar Siswa</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Daftar Siswa</IonTitle>
          </IonToolbar>
        </IonHeader>

        {loading ? (
          <>
            <IonProgressBar type="indeterminate"></IonProgressBar>
            <IonText color="secondary">
              <h2>Memuat Data...</h2>
            </IonText>
          </>
        ) : (
          <IonList>
            {students.map((student: Student) => (
              <IonItem key={student.id}>
                <IonLabel>
                  <h2>{student.name}</h2>
                  <p>{student.address} - {(student.gender === 'L') ? 'Pria' : 'Wanita'}</p>
                </IonLabel>
                <IonButton color="primary" onClick={() => history.push('/student-edit', { student })} >
                  <IonIcon icon={pencil} />
                </IonButton>
                <IonButton color="danger" onClick={() => { setSelectedId(student.id); setShowAlert(true) }}>
                  <IonIcon icon={trash} />
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => history.push('/student-add')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>

      {/* IonAlert untuk konfirmasi sebelum menghapus */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Konfirmasi"
        message="Yakin ingin menghapus data siswa ini?"
        buttons={[
          {
            text: "Batal",
            role: "cancel",
            handler: () => setSelectedId(null),
          },
          {
            text: "Hapus",
            handler: handleDelete,
          },
        ]}
      />
      <AlertOK isOpen={showOkAlert} onDidDismiss={() => setShowOkAlert(false)} header={alertMessage} />

    </IonPage>
  );
};

export default StudentList;
