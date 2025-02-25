import { useCallback, useEffect, useState } from 'react'
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
import { pencil, trash, add, exitOutline } from "ionicons/icons"
import './StudentList.css'
import { getAllData, deleteData, Student } from '../hooks/restAPIRequest'
import AlertOK from '../components/AlertOK'
import { useHistory, useLocation } from 'react-router-dom'
import { useAuth } from "../hooks/useAuthCookie";

interface DontRefresh {
  dontRefresh: boolean;
}

const StudentList: React.FC = () => {

  const { token, role, logout } = useAuth();
  const history = useHistory();
  const location = useLocation<DontRefresh>();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showLogoutAlert, setLogoutShowAlert] = useState(false);
  const [showOkAlert, setShowOkAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isRefresh, setIsRefresh] = useState(true);
  const [isRole, setIsRole] = useState<string | null>(null);
  const [showRefreshButton, setShowRefreshButton] = useState(false);

  const dontRefresh = location.state?.dontRefresh || false;


  useEffect(() => {
    setIsRole(role);
    if (token === null && role === null) {
      history.replace("/login", { isTokenExpired: true });
    }
  }, [token, role, history]);

  const fetchStudents = useCallback(async () => {
    setLoading(true)

    setShowRefreshButton(false);
    // Timer untuk menampilkan tombol jika lebih dari 6 detik
    const timeoutId = setTimeout(() => {
      setShowRefreshButton(true);
    }, 5000);

    await getAllData(setStudents)

    // Jika fetch selesai lebih cepat, batalkan timeout
    clearTimeout(timeoutId);

    setLoading(false)

  }, [])

  useIonViewWillEnter(() => {
    setIsRefresh(false);
    fetchStudents()
  }, [])

  useEffect(() => {
    if (isRefresh) {
      setIsRefresh(false)
    }
  }, [isRefresh])

  const handleDelete = async () => {
    if (selectedId) {
      const result = await deleteData(selectedId)

      if (result.success) {
        setShowOkAlert(true)
        setAlertMessage("siswa berhasil dihapus!")

        // getAllData(setStudents)
        fetchStudents();

      } else {
        setShowOkAlert(true)
        setAlertMessage("siswa gagak dihapus!" + result.error)
      }
    }
    setSelectedId(null);
  }

  const handleLogout = () => {
    logout();
  }

  let content;
  if (!token || loading) {
    content = (
      <>
        <IonProgressBar type="indeterminate"></IonProgressBar>
        <IonText color="secondary">
          <h2>Memuat Data... </h2>
          {showRefreshButton && (
            <IonButton onClick={fetchStudents} color="primary" expand="full">
              Refresh
            </IonButton>
          )}
        </IonText>
      </>
    )
  } else {
    content = (
      <IonList>
        {students.map((student: Student) => (
          <IonItem key={student.id}>
            <IonLabel>
              <h2>{student.name}</h2>
              <p>{student.address} - {(student.gender === 'L') ? 'Pria' : 'Wanita'}</p>
            </IonLabel>
            {isRole === 'admin' ? (
              <>
                <IonButton color="primary" onClick={() => history.push('/student-edit', { student })} >
                  <IonIcon icon={pencil} />
                </IonButton>
                <IonButton color="danger" onClick={() => { setSelectedId(student.id); setShowAlert(true) }}>
                  <IonIcon icon={trash} />
                </IonButton>
              </>
            ) : ('')}
          </IonItem>
        ))}
      </IonList>
    )
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

        {content}

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => history.push('/student-add')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonFab vertical="bottom" horizontal="end" slot="fixed" color="danger">
          <IonFabButton onClick={() => setLogoutShowAlert(true)}>
            <IonIcon icon={exitOutline} />
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

      {/* IonAlert untuk konfirmasi Logout */}
      <IonAlert
        isOpen={showLogoutAlert}
        onDidDismiss={() => setLogoutShowAlert(false)}
        header="Konfirmasi"
        message="Yakin ingin Logout akun?"
        buttons={[
          {
            text: "Batal",
            role: "cancel",
            handler: () => setSelectedId(null),
          },
          {
            text: "Keluar",
            handler: handleLogout,
          },
        ]}
      />
      <AlertOK isOpen={showOkAlert} onDidDismiss={() => setShowOkAlert(false)} header={alertMessage} />

    </IonPage>
  );
};

export default StudentList;
