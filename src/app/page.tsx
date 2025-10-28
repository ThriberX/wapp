import LandingPage from "@/components/AiChatbot"
import PageViewer from "@/components/pageviewer"
import ThriberMode from "@/components/thriberMode"
import Contactus from "@/components/aboutUs"

export default function HomePage() {
    return (
      <>
      <main className=" bg-black">
        <PageViewer/>
        <ThriberMode/>
        <Contactus/>
        <LandingPage/>
      </main>
      </>
    )
  }