import  axios  from  "./util/axios.customize"
import  {  useEffect  }  from  "react"

function App() {

  useEffect (()  =>  {
    const  fetchHelloWorld  =  async ()  =>  {
      const  res  =  await  axios . get ( `${import.meta.env.VITE_BACKEND_ULR}/v1/api/` );
      console . log ( " >>> check res: " ,  res )
    }

    fetchHelloWorld ()
  },  [])


  return (
    <>
      hello world
    </>
  )
}

export default App
