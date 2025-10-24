import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { libraryApi } from '@/lib/api';

// Define User interface locally since it's not exported from the API
interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  role: 'ADMIN' | 'STUDENT' | 'TEACHER' | 'LIBRARIAN' | 'STAFF';
  status: 'ACTIVE' | 'INACTIVE';
  registrationNumber: string;
  profileCompleted: boolean;
  lastLoginAt: string;
  createdAt: string;
}

function UserInfoAndLogout() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await libraryApi.getMe();
        console.log(response);
        setUser(response.data as User);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      libraryApi.clearToken();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full bg-black/20 border-t border-white/10 px-4 py-4 backdrop-blur-lg">
      {user ? (
        <>
          <div className="text-sm text-white/80 mb-3">
            <p>{user.name}</p>
            <p className="text-xs text-white/60">{user.role.toLowerCase()}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-center text-sm font-medium text-white/90 bg-white/5 border border-white/10 rounded-xl py-2 transition-all duration-200 hover:bg-red-500/10 hover:text-white/100 active:scale-[0.98] backdrop-blur-md"
          >
            Logout
          </button>
        </>
      ) : (
        <p className="text-sm text-white/50">Loading user...</p>
      )}
    </div>
  );
}

export default UserInfoAndLogout;