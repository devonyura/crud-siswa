import React from "react";
import Cookies from "js-cookie";

export interface ApiResponse {
	success: boolean;
	data?: any;
	error?: string;
}

export interface Student {
	id: string;
	name: string;
	address: string;
	gender: string;
}

export interface Auth {
	username: string;
	password: string;
}

export interface DataToken {
	status: string;
	message: string;
	token: string;
}

export const loginRequest = async (authData: Auth): Promise<ApiResponse> => {
	return new Promise(async (resolve, reject) => {
		try {

			// Konfigurasi request dengan header Authorization
			const response = await fetch(`/api/auth/login`, {
				method: "POST",
				body: JSON.stringify(authData),
			});

			// Check Response
			checkOKResponse(response);

			// Ubah data ke json format
			const data: DataToken = await response.json();

			console.info("Status Request loginRequest() : ", data.status);

			resolve({ success: true, data });

		}
		catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
			console.error("Error Login:", error);
			reject({ success: false, error: errorMessage || "Terjadi kesalahan" });
		}
	});
};

const checkOKResponse = (response: any) => {
	if (!response.ok) {
		if (response.status === 401) {
			console.error("Unauthorized! Token mungkin sudah expired/salah.")
		}
		throw new Error(`HTTP error! Status: ${response.status}`)
	}
}


export const getAllData = async (setStudens: React.Dispatch<React.SetStateAction<Student[]>>) => {
	// localStorage.setItem("token", JSON.stringify(data));
	try {
		// Ambil token JWT dari localStorage
		const TOKEN = Cookies.get("token");

		// Konfigurasi request dengan header Authorization
		const response = await fetch(`/api/siswa`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${TOKEN}`,
			},
		});

		// Check Response
		checkOKResponse(response);

		// Ubah data ke json format
		const data = await response.json();

		console.info("Status Request getAllData() : ", data.status);

		// set State student
		setStudens(data.data);

	} catch (error) {
		// Kirim error jika gagal request
		console.error("Error Fetching Students", error);
		return error;
	}
};

export const getDataById = async (id: string): Promise<Student | null> => {
	try {
		// Ambil token JWT dari localStorage
		const TOKEN = Cookies.get("token");

		// Konfigurasi request dengan header Authorization
		const response = await fetch(`/api/siswa/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${TOKEN}`,
			},
		});

		// Check Response
		checkOKResponse(response);

		// Ubah data ke json format
		const data = await response.json();

		console.info("Status Request getDataById() : ", data.status);

		// set State student
		return data.data;

	} catch (error) {
		console.error("Error Fetching Student by ID:", error);
		return null;
	}
};


export const saveData = async (newStudents: object): Promise<ApiResponse> => {
	return new Promise(async (resolve, reject) => {
		try {
			// Ambil token JWT dari localStorage
			const TOKEN = Cookies.get("token");

			// Konfigurasi request dengan header Authorization
			const response = await fetch(`/api/siswa`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${TOKEN}`,
				},
				body: JSON.stringify(newStudents),
			});

			// Check Response
			checkOKResponse(response);

			// Ubah data ke json format
			const data = await response.json();

			console.info("Status Request saveData() : ", data.status);
			resolve({ success: true, data });
		}
		catch (error) {
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

			// Ambil token JWT dari localStorage
			const TOKEN = Cookies.get("token");

			// Konfigurasi request dengan header Authorization
			const response = await fetch(`/api/siswa/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${TOKEN}`,
				}
			});

			// Check Response
			checkOKResponse(response);

			// Ubah data ke json format
			const data = await response.json();

			console.info("Status Request deleteData() : ", data.status);
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

			// Ambil token JWT dari localStorage
			const TOKEN = Cookies.get("token");

			// Konfigurasi request dengan header Authorization
			const response = await fetch(`/api/siswa/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${TOKEN}`,
				},
				body: JSON.stringify(updatedStudent),
			});

			// Check Response
			checkOKResponse(response);

			// Ubah data ke json format
			const data = await response.json();

			console.info("Status Request updateData() : ", data.status);
			resolve({ success: true, data });
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
			console.error("Error Editing Student:", error);
			reject({ success: false, error: errorMessage });
		}
	});
};