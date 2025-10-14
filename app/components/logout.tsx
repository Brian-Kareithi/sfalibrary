import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, type User } from '@/lib/api';

function UserInfoAndLogout() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.getMe();
        console.log(response);
        setUser(response.user as unknown as User);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
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
