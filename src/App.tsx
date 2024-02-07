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
    loadCustomers() 
  },[])

  async function loadCustomers (){
    const response = await api.get("/list-customers")
    setCustomers(response.data)
  }

  
  
  // Pegas as informações do DOM e tenta criar um novo cliente no banco de dados
  async function handleSubmit(e: FormEvent){
    e.preventDefault()
    if( !nameRef.current?.value || !emailRef.current?.value) {
      alert("Confira os campos do Formulário e tente novamente")
      return
    }

    const response = await api.post("/customer", {
      name: nameRef.current.value,
      email: emailRef.current.value
    })

    nameRef.current.value = ""
    emailRef.current.value = ""
    setCustomers(customers => [...customers, response.data])
    //alert(JSON.stringify(response.data))
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
    <div className="w-full min-h-screen bg-gray-800 flex justify-center px-4">
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

      {customers.map((customer) => (

          <article key={customer.id} id={customer.id} className=" w-full bg-slate-600 p-5 my-2 rounded text-slate-200 font-medium relative outline-2 hover:scale-105 duration-100">
          <p><span className="font-bold">Nome: </span>{customer.name}</p>
          <p><span className="font-bold">Email: </span>{customer.email}</p>
          <p><span className="font-bold">Nome: </span>{customer.status ? "ATIVO" : "INATIVO"}</p>

          <button
            onClick={() => console.log(deleteCustomer(customer.id))}
            className='bg-slate-500 p-2 rounded-lg shadow-md absolute -right-2 -top-2 hover:bg-red-400 active:-translate-y-0.5'
          >
            <FiTrash2 size={18}/>
          </button>

          </article>

      ))}
      </section>
      </main>
    </div>
  )
}