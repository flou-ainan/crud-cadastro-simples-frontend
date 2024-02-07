import { useEffect, useState, useRef, FormEvent } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { api } from "./services/api"


interface CustomerProps {
  id: string
  email: string
  name: string
  status: boolean
  created_at: string

}

export default function App(){

  const [customers, setCustomers] = useState<CustomerProps[]>([])
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  
  useEffect (() => {
    const log = loadCustomers()
    console.log(log)
  },[])

  async function loadCustomers (){
    try{
      const response = await api.get("/list-customers")
      setCustomers(response.data)
    }catch(err){
      alert(err)
      alert("Ocorreu algum erro de conexão com o servidor, tente novamente mais tarde ou entre em contato flouainan@gmail.com")
    }
  }

  console.log()  
  
  // Pegas as informações do DOM e tenta criar um novo cliente no banco de dados
  async function handleSubmit(e: FormEvent){
    e.preventDefault()
    if( !nameRef.current?.value || !emailRef.current?.value) {
      alert("Confira os campos do Formulário e tente novamente")
      return
    }

    try {
      const response = await api.post("/customer", {
        name: nameRef.current.value,
        email: emailRef.current.value
      })

      nameRef.current.value = ""
      emailRef.current.value = ""
      setCustomers(customers => [...customers, response.data])
      //alert(JSON.stringify(response.data))
  }catch(err){
    alert("Operação malsucedida:\n" + err)
    console.error("*********\n\nOperação malsusecida: " + err + "\n\n *********")
  }
  }

  //Deleta um cliente do banco atraves de um dado ID
  async function deleteCustomer(id:string) {
    if (confirm("Tem certeza que deseja deletar este cliente ?")){
      try {
        await api.delete("/customer", {
          params:{
            id: id
          }
        })
      }catch(err){
        await console.log(err)
        alert("Operaçẽo malsusedida")
        setTimeout(() => location.reload(), 0)
      }
      alert("Cliente deletado")
      const newCustomers = customers.filter((customer) => {
        return customer.id !== id
      }) 
      setCustomers(newCustomers)
    }
  }

  return(
    <div className="min-w-96 w-full min-h-screen bg-gray-800 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-3xl">
      <h1 className="text-4xl font-medium text-white">Clientes</h1>

      <form className="flex flex-col my-6" onSubmit={handleSubmit}>
        <label className="font-bold text-white" htmlFor="name">Nome:</label>
        <input
          id="name"
          type="text"
          placeholder="Digite seu nome completo..."
          className="mb-5 p-2 rounded"
          ref={nameRef}
        />
        <label className="font-bold text-white" htmlFor="email">Email:</label>
        <input
          id="email"
          type="text"
          placeholder="Digite seu email..."
          className="mb-5 p-2 rounded"
          ref={emailRef}
        />

        <input type="submit" value="Cadastrar" 
                className="cursor-pointer p-2 bg-slate-300 rounded-full self-center w-full my-2 hover:bg-slate-100 active:-translate-y-0.5 md:w-64 md:self-start"
        />
      </form>

      <section className="flex flex-col px-4">

      {
      customers.length != 0 &&
      customers.map((customer) => (

          <article key={customer.id} id={customer.id} className=" w-full bg-slate-600 p-5 my-2 rounded text-slate-200 font-medium relative outline-2 hover:scale-105 duration-100">
          <p><span className="font-bold">Nome: </span>{customer.name}</p>
          <p><span className="font-bold">Email: </span>{customer.email}</p>
          <p><span className="font-bold">Status: </span>{customer.status ? "ATIVO" : "INATIVO"}</p>

          <button
            onClick={() => console.log(deleteCustomer(customer.id))}
            className='bg-slate-500 p-2 rounded-lg shadow-md absolute -right-2 -top-2 hover:bg-red-400 active:-translate-y-0.5'
          >
            <FiTrash2 size={18}/>
          </button>

          </article>

      )) || 
        <div className='text-slate-400 font-bold text-xl text-center mt-6'>
                    <h4>Carregando Banco de Dados...</h4>
          <div className='mt-4 flex justify-center justify-items-center' role="status">
              <svg aria-hidden="true" className="self w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
          </div>

        </div>}
      </section>
      </main>
    </div>
  )
}