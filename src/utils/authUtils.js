import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, query, collection, getDocs, where } from 'firebase/firestore';

// Function to log in a user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user role from Firestore
    const userDocRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        user,
        id: user.uid,
        email: userData.email,
        name: userData.name,
        surname: userData.surname,
        role: userData.role,
        employeeNumber: userData.employeeNumber,
      };
    } else {
      console.error('No such user document!');
      return null;
    }
  } catch (error) {
    console.error('Error logging in user: ', error);
    return null;
  }
};

// Function to log out a user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out user: ', error);
  }
};

// Function to activate a new account
export const activateAccount = async (email, password) => {
  try {
    // Search all branches for the employee with the given email
    const branchesQuery = query(collection(firestore, 'branches'));
    const branchesSnapshot = await getDocs(branchesQuery);
    let employeeData = null;
    let branchId = null;

    for (const branchDoc of branchesSnapshot.docs) {
      const branchIdTemp = branchDoc.id;
      const employeesQuery = query(collection(firestore, `branches/${branchIdTemp}/employees`), where('email', '==', email));
      const employeesSnapshot = await getDocs(employeesQuery);

      if (!employeesSnapshot.empty) {
        employeeData = employeesSnapshot.docs[0].data();
        branchId = branchIdTemp;
        break;
      }
    }

    if (!employeeData) {
      console.error('No such employee!');
      return { success: false, message: 'No employee found with this email.' };
    }

    const { employeeNumber, name, surname, head } = employeeData;
    const role = head ? 'admin' : 'employee';

    // Create a new user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user document to Firestore
    await setDoc(doc(firestore, 'users', user.uid), {
      email: email,
      name: name,
      surname: surname,
      role: role,
      employeeNumber: employeeNumber,
      branchId: branchId,
    });

    return { success: true, user, role };
  } catch (error) {
    console.error('Error activating account: ', error);
    return { success: false, message: error.message };
  }
};