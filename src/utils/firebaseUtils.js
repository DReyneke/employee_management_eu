import { firestore } from '../firebase';
import { doc, setDoc, getDocs , collection, query, orderBy, getDoc, where, updateDoc, deleteDoc } from 'firebase/firestore';

// Function to add a branch
export const addBranch = async (branchId, branch) => {
  try {
    await setDoc(doc(firestore, 'branches', branchId), branch);
  } catch (error) {
    console.error('Error adding branch: ', error);
  }
};

// Function to get all branches
export const getBranches = async () => {
  try {
    const branchesQuery = query(collection(firestore, 'branches'), orderBy('name'));
    const querySnapshot = await getDocs(branchesQuery);
    const branches = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return branches;
  } catch (error) {
    console.error('Error getting branches: ', error);
    return [];
  }
};

// Function to update a branch
export const updateBranch = async (branchId, updatedBranchData) => {
  try {
    await setDoc(doc(firestore, 'branches', branchId), updatedBranchData, { merge: true });
  } catch (error) {
    console.error('Error updating branch: ', error);
  }
};

// Function to remove a branch
export const removeBranch = async (branchId) => {
  try {
    await deleteDoc(doc(firestore, 'branches', branchId));
  } catch (error) {
    console.error('Error removing branch: ', error);
  }
};

// Function to search branches based on criteria
export const searchBranches = async ({ branchId, name, location }) => {
  try {
    let branchesQuery = collection(firestore, 'branches');

    if (branchId) {
      branchesQuery = query(branchesQuery, where('__name__', '==', branchId));
    }
    if (name) {
      branchesQuery = query(branchesQuery, where('name', '>=', name), where('name', '<=', name + '\uf8ff'));
    }
    if (location) {
      branchesQuery = query(branchesQuery, where('location', '>=', location), where('location', '<=', location + '\uf8ff'));
    }

    const querySnapshot = await getDocs(branchesQuery);
    const branches = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return branches;
  } catch (error) {
    console.error('Error searching branches: ', error);
    return [];
  }
};

// Function to get employees for a specific branch
export const getEmployeesForBranch = async (branchId) => {
  try {
    const employeesQuery = query(collection(firestore, `branches/${branchId}/employees`));
    const querySnapshot = await getDocs(employeesQuery);
    const employees = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return employees;
  } catch (error) {
    console.error('Error getting employees: ', error);
    return [];
  }
};

// Function to add an employee
export const addEmployee = async (branchId, employee) => {
  try {
    const positionDocRef = doc(firestore, `positions/${employee.positionID}`);
    const positionDoc = await getDoc(positionDocRef);

    if (!positionDoc.exists()) {
      await setDoc(positionDocRef, { name: employee.positionID });
    }

    var managerPosition;

    if (employee.managerNumber == 0){
      managerPosition = "None";
    }else{
      managerPosition = await getManagerPosition(employee.managerNumber, branchId);
    }

    const managerDocRef = doc(firestore, `positions/${employee.positionID}/managers/${managerPosition}`);
    const managerDoc = await getDoc(managerDocRef);

    if (!managerDoc.exists()) {
      await setDoc(managerDocRef, {});
    }

    await setDoc(doc(firestore, `branches/${branchId}/employees`, employee.employeeNumber), employee);
  } catch (error) {
    console.error('Error adding employee: ', error);
  }
};

// Function to get position by id
export const getPositionName = async (positionID) => {
  try {
    const positionDocRef = doc(firestore, `positions/${positionID}`);
    const positionDoc = await getDoc(positionDocRef);
    if (positionDoc.exists()) {
      return positionDoc.data().name;
    } else {
      console.error('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting position name: ', error);
    return null;
  }
};

// Function to get manager name by id
export const getManagerName = async (managerNumber, branchId) => {
  try {
    if (managerNumber === 0) {
      return "None";
    }

    const managersQuery = query(
      collection(firestore, `branches/${branchId}/employees`),
      where('employeeNumber', '==', managerNumber)
    );

    const querySnapshot = await getDocs(managersQuery);
    if (!querySnapshot.empty) {
      const managerDoc = querySnapshot.docs[0];
      return `${managerDoc.data().name} ${managerDoc.data().surname}`;
    } else {
      console.error('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting manager name: ', error);
    return null;
  }
};

// Function to get the manager position ID
export const getManagerPosition = async (managerNumber, branchId) => {
  try {
    const managersQuery = query(
      collection(firestore, `branches/${branchId}/employees`),
      where('employeeNumber', '==', managerNumber)
    );

    const querySnapshot = await getDocs(managersQuery);
    if (!querySnapshot.empty) {
      const managerDoc = querySnapshot.docs[0];
      return `${managerDoc.data().positionID}`;
    } else {
      console.error('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting manager name: ', error);
    return null;
  }
};

// Function to get root positions
export const getRootPosition = async (branchId) => {
  try {
    const rootQuery = query(collection(firestore, `branches/${branchId}/employees`), where('head', '==', true));
    const querySnapshot = await getDocs(rootQuery);
    if (!querySnapshot.empty) {
      const rootPositionDoc = querySnapshot.docs[0];
      return { id: rootPositionDoc.id, ...rootPositionDoc.data() };
    } else {
      console.error('No root position found!');
      return null;
    }
  } catch (error) {
    console.error('Error getting root position: ', error);
    return null;
  }
};

// Function to get positions managed by a specific position
export const getManagedPositions = async (positionId) => {
  try {
    const positionsCollectionRef = collection(firestore, 'positions');
    const positionsSnapshot = await getDocs(positionsCollectionRef);

    const managedPositionIds = [];

    for (const positionDoc of positionsSnapshot.docs) {
      const managersDocRef = doc(firestore, `positions/${positionDoc.id}/managers/${positionId}`);

      const managerDocSnapshot = await getDoc(managersDocRef);
      if (managerDocSnapshot.exists()) {
        managedPositionIds.push(positionDoc.id);
      }
    }
    
    return managedPositionIds;
  } catch (error) {
    console.error('Error getting managed positions: ', error);
    return [];
  }
};

// Function to get employees by position within a specific branch
export const getEmployeesByPosition = async (branchId, positionId, managerNumber) => {
  try {
    const employeesQuery = query(collection(firestore, `branches/${branchId}/employees`), where('positionID', '==', positionId), where('managerNumber', '==', managerNumber));
    const querySnapshot = await getDocs(employeesQuery);
    const employees = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return employees;
  } catch (error) {
    console.error('Error getting employees by position: ', error);
    return [];
  }
};

// Function to remove an employee and update the subordinates
export const removeEmployee = async (branchId, employeeNumber) => {
  try {
    const employeeDocRef = doc(firestore, `branches/${branchId}/employees/${employeeNumber}`);
    const employeeDoc = await getDoc(employeeDocRef);

    if (!employeeDoc.exists()) {
      console.error('No such employee!');
      return;
    }

    const employeeData = employeeDoc.data();
    const managerNumber = employeeData.managerNumber;
    const managerName = employeeData.managerName;

    const subordinatesQuery = query(
      collection(firestore, `branches/${branchId}/employees`),
      where('managerNumber', '==', employeeNumber)
    );

    const subordinatesSnapshot = await getDocs(subordinatesQuery);

    for (const subordinateDoc of subordinatesSnapshot.docs) {
      const subordinateData = subordinateDoc.data();
      const subordinateId = subordinateDoc.id;
      const subordinatePositionID = subordinateData.positionID;

      await updateDoc(doc(firestore, `branches/${branchId}/employees/${subordinateId}`), {
        managerNumber: managerNumber,
        managerName: managerName
      });

      const managerPosition = await getManagerPosition(managerNumber, branchId);

      const newManagerDocRef = doc(firestore, `positions/${subordinatePositionID}/managers/${managerPosition}`);
      const newManagerDoc = await getDoc(newManagerDocRef);

      if (!newManagerDoc.exists()) {
        await setDoc(newManagerDocRef, {});
      }
    }

    await deleteDoc(employeeDocRef);

  } catch (error) {
    console.error('Error removing employee: ', error);
  }
};

// Function to update an employee
export const updateEmployee = async (branchId, employeeNumber, updatedEmployeeData) => {
  try {
    const positionDocRef = doc(firestore, `positions/${updatedEmployeeData.positionID}`);
    const positionDoc = await getDoc(positionDocRef);

    if (!positionDoc.exists()) {
      await setDoc(positionDocRef, { name: updatedEmployeeData.positionID });
    }

    var managerPosition;

    if (updatedEmployeeData.managerNumber == 0){
      managerPosition = "None";
    }else{
      managerPosition = await getManagerPosition(updatedEmployeeData.managerNumber, branchId);
    }

    const managerDocRef = doc(firestore, `positions/${updatedEmployeeData.positionID}/managers/${managerPosition}`);
    const managerDoc = await getDoc(managerDocRef);

    if (!managerDoc.exists()) {
      await setDoc(managerDocRef, {});
    }

    const employeeDocRef = doc(firestore, `branches/${branchId}/employees/${employeeNumber}`);
    await updateDoc(employeeDocRef, updatedEmployeeData);
  } catch (error) {
    console.error('Error updating employee: ', error);
  }
};

// Search employees based on criteria
export const searchEmployees = async (branchId, { employeeNumber, name, surname, managerName, positionID }) => {
  try {
    let employeesQuery = collection(firestore, `branches/${branchId}/employees`);

    if (employeeNumber) {
      employeesQuery = query(employeesQuery, where('employeeNumber', '==', employeeNumber));
    }
    if (name) {
      employeesQuery = query(employeesQuery, where('name', '>=', name), where('name', '<=', name + '\uf8ff'));
    }
    if (surname) {
      employeesQuery = query(employeesQuery, where('surname', '>=', surname), where('surname', '<=', surname + '\uf8ff'));
    }
    if (managerName) {
      employeesQuery = query(employeesQuery, where('managerName', '>=', managerName), where('managerName', '<=', managerName + '\uf8ff'));
    }
    if (positionID) {
      employeesQuery = query(employeesQuery, where('positionID', '>=', positionID), where('positionID', '<=', positionID + '\uf8ff'));
    }

    const querySnapshot = await getDocs(employeesQuery);
    const employees = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return employees;
  } catch (error) {
    console.error('Error searching employees: ', error);
    return [];
  }
};