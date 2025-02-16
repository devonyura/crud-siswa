import React from "react";
const REST_API_URL = "https://api.rindapermai.com/api";

export const getAllData = async (setStudens: React.Dispatch<React.SetStateAction<Student[]>>) => {
  try {
    const response = await fetch(`${REST_API_URL}/siswa`);
    const data = await response.json();
    setStudens(data);
  } catch (error) {
    console.error("Error Fetching Students",error);
    return error;
  }
}

export const getDataById = async (id: string): Promise<Student | null> => {
	try {
		const response = await fetch(`${REST_API_URL}/siswa/${id}`);
		if (!response.ok) {
			throw new Error('Gagal mengambil data siswa');
		}
		const data: Student = await response.json();
		return data;
	} catch (error) {
		console.error("Error Fetching Student by ID:", error);
		return null;
	}
};


export const saveData = async (newStudents: object): Promise<ApiResponse> => {
	console.log(newStudents);
	return new Promise(async (resolve, reject) => {
		try {
			const response = await fetch(`${REST_API_URL}/siswa`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newStudents),
			});

			// Jika response gagal, lempar error
			if (!response.ok) {
				const errorData = await response.json(); // Ambil pesan error dari server jika ada
				throw new Error(errorData?.message || "Gagal menambah murid");
			}

			// Ambil data sukses dari server
			const data = await response.json();
			resolve({ success: true, data });

		} catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
			console.error("Error Fetching Students:", error);
			reject({ success: false, error: errorMessage || "Terjadi kesalahan" });
		}
	});
};

// Function untuk menghapus data siswa berdasarkan ID
export const deleteData = async (id: string): Promise<ApiResponse> => {
	return new Promise(async (resolve, reject) => {
		try {
			const response = await fetch(`${REST_API_URL}/siswa/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData?.message || "Gagal menghapus murid");
			}

			resolve({ success: true });

		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
			console.error("Error Deleting Student:", errorMessage);
			reject({ success: false, error: errorMessage });
		}
	});
};

export const updateData = async (id: string, updatedStudent: object): Promise<ApiResponse> => {
	return new Promise(async (resolve, reject) => {
		try {
			const response = await fetch(`${REST_API_URL}/siswa/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updatedStudent),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData?.message || "Gagal mengedit siswa");
			}

			const data = await response.json();
			resolve({ success: true, data });
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
			console.error("Error Editing Student:", error);
			reject({ success: false, error: errorMessage });
		}
	});
};

export interface ApiResponse {
	success: boolean;
	data?: any;
	error?: string;
}

export interface Student {
	id: string;
	nama: string;
	alamat: string;
	gender: string;
}