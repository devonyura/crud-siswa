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
} from '@ionic/react';
import { pencil, trash } from "ionicons/icons";
import './Tab1.css';
import AddStudentModal from '../components/AddStudentModal'
import EditStudentModal from '../components/EditStudentModal'
import { getAllData, deleteData, Student } from '../hooks/restAPIRequest'
import AlertOK from '../components/AlertOK';


const StudentList: React.FC = () => {
	const[students, setStudents] = useState<Student[]>([]);
  const[loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showOkAlert, setShowOkAlert] = useState(false);
  const [alertMessage, setAlertMessage ] = useState('');
  
  // edit
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchStudents = async () => {
    // setLoading(true);
    await getAllData(setStudents);

    setLoading(false);
  }

  useEffect(() => {    
    fetchStudents();
  }, []);

  const handleDelete = async () => {
    if (selectedId) {
      const result = await deleteData(selectedId);

      if (result.success) {
        setShowOkAlert(true);
        setAlertMessage("siswa berhasil dihapus!");

        getAllData(setStudents);
      } else {
        setShowOkAlert(true);
        setAlertMessage("siswa gagak dihapus!" + result.error);
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
        ):(
          <IonList>
          {students.map((student) => (
            <IonItem key={student.id}>
              <IonLabel>
                <h2>{student.nama}</h2>
                <p>{student.alamat} - {(student.gender === 'L' )?'Pria':'Wanita'}</p>
              </IonLabel>
              <IonButton color="primary" onClick={() => { setSelectedStudent(student); setShowEditModal(true)}}>
                <IonIcon icon={pencil} />
              </IonButton>
              <IonButton color="danger" onClick={() => { setSelectedId(student.id); setShowAlert(true) }}>
                <IonIcon icon={trash} />
              </IonButton>
            </IonItem>
          ))}
          </IonList>
        )}
        <AddStudentModal fetchStudents={fetchStudents} />
        <EditStudentModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          student={selectedStudent}
          fetchStudents={() => getAllData(setStudents)}
        />

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

      {/* <IonAlert
        isOpen={showOkAlert}
        onDidDismiss={() => setShowOkAlert(false)}
        header={alertMessage}
        buttons={['OK']}
      /> */}
      <AlertOK isOpen={showOkAlert} onDidDismiss={() => setShowOkAlert(false)} header={alertMessage} />
		</IonPage>
	);
};

export default StudentList;
