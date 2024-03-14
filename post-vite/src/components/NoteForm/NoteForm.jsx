import React, { useState, useEffect } from "react"
import axios from "axios"
import { Form, Input, Button } from "antd"
import "./NoteForm.css"
import Header from "../Header/Header"
import MiLista from "../List/MiLista"

const NoteForm = () => {
  const [notes, setNotes] = useState([])
  const [form] = Form.useForm()

  useEffect(() => {
    async function obtenerNotas() {
      try {
        const URL = "http://localhost:3001/api/note"
        const respuesta = await axios.get(URL)
        setNotes(respuesta.data)
      } catch (e) {
        console.error("Error al obtener las notas desde el server:", e)
      }
    }

    obtenerNotas()
  }, [])

  const onFinish = async (values) => {
    try {
      const data = {
        title: values.title,
        text: values.note,
      }
      const URL = "http://localhost:3001/api/note"
      fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          const nuevaNota = res
          setNotes([...notes, nuevaNota])
          console.log("post note: ", values)
          form.resetFields()
        })
    } catch (e) {
      console.error("Error:", e)
    }
  }

  return (
    <div className="container">
      <Header />

      <Form
        form={form}
        name="note-form"
        onFinish={onFinish}
        className="Form"
        labelCol={{ flex: "200px" }}
        labelAlign="left"
        labelWrap
        wrapperCol={{ flex: 1 }}
        colon={false}
        style={{ maxWidth: 800, marginTop: "30px" }}
      >
        <Form.Item
          name="title"
          rules={[
            {
              required: true,
              message: "Por favor, ingresa un título",
            },
          ]}
        >
          <Input placeholder="Título" />
        </Form.Item>

        <Form.Item
          name="note"
          rules={[
            {
              required: true,
              message: "Por favor, ingresa el contenido de tu nota",
            },
          ]}
        >
          <Input placeholder="Post" />
        </Form.Item>

        <Form.Item style={{ textAlign: "right" }}>
          <Button
            type="primary"
            htmlType="submit"
          >
            Publicar
          </Button>
        </Form.Item>
      </Form>
      <MiLista notes={notes} />
    </div>
  )
}

export default NoteForm
