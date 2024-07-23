import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {redirect} from "next/navigation";
import { getUserByID, getUserWithNoConnection } from "./neo4j.action";
import HomePageClientComponent from "./components/Home";

export default async function Home()  {
  const { isAuthenticated ,getUser}= getKindeServerSession();

  if(!await isAuthenticated){
    return redirect(
      "/api/auth/login?post_login_redirect_url=http://localhost:3000/callback"
    );
  }
  const user=await getUser();
  if(!user){
    return redirect(
      "/api/auth/login?post_login_redirect_url=http://localhost:3000/callback"
    );
  }

  const userWithNoConnection= await getUserWithNoConnection(user.id);
  const currentUser=await getUserByID(user.id);

  return (
      <main>
        {currentUser && (
        <HomePageClientComponent currentUser={currentUser} users={userWithNoConnection}/>
        )}
      </main>
  );
    
}
