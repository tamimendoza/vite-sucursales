import { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { MapContainer, Marker, TileLayer, Tooltip, useMapEvents } from 'react-leaflet'

const API_URL = 'http://localhost:8080/sucursales'

function EventoClickMapa({ onClick }) {
	useMapEvents({
		click: (e) => {
			onClick(e.latlng)
		}
	})
}

function App() {
	const posicionInicial = [51.505, -0.09]

	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [posicionMarcador, setPosicionMarcador] = useState(null)
	const [descripcion, setDescripcion] = useState('')
	const [marcadores, setMarcadores] = useState([])

	const getAPIMarcadores = async () => {
		const response = await fetch(API_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
		if (response.ok) {
			const data = await response.json()
			let _marcadores = []
			data.forEach((sucursal) => {
				_marcadores.push({
					posicion: [sucursal.latitud, sucursal.longitud],
					descripcion: sucursal.descripcion
				})
			})
			setMarcadores(_marcadores)
		}
	}

	const postAPIMarcador = async (_posicion, _descripcion) => {
		const response = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(
				{
					latitud: _posicion.lat,
					longitud: _posicion.lng,
					descripcion: _descripcion
				}
			)
		})
		if (response.ok) {
			return await response.json()
		}
		throw new Error('Error al agregar marcador')
	}

	useEffect(() => {
		getAPIMarcadores()
	}, [])

	const abrirModal = (posicion) => {
		setPosicionMarcador(posicion)
		setModalIsOpen(true)
	}

	const agregarMarcador = async (posicion) => {
		try {
			let marcador = { posicion, descripcion }
			let marcadorDB = await postAPIMarcador(posicion, descripcion)
			marcador.id = marcadorDB.id

			setMarcadores([...marcadores, marcador])
			setModalIsOpen(false)
			setDescripcion('') 
		} catch (error) {
			console.err(error)
		}
	}

	return (
		<>
			<MapContainer center={posicionInicial} zoom={13} scrollWheelZoom={false}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{marcadores.map((marcador) => (
					<Marker key={marcador.id} position={marcador.posicion}>
						<Tooltip direction='top' offset={[-15, -15]} opacity={1} permanent>{marcador.descripcion}</Tooltip>
					</Marker>
				))}
				<EventoClickMapa onClick={abrirModal} />
			</MapContainer>
			<Modal show={modalIsOpen} onHide={() => {setModalIsOpen(false); setDescripcion('')}}>
				<Modal.Header closeButton>
					<Modal.Title>Agregar Descripción</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<input type="text" autoFocus value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={() => {setModalIsOpen(false); setDescripcion('')}}>Cancelar</Button>
					<Button variant='primary' onClick={() => { agregarMarcador(posicionMarcador) }}>Guardar</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default App
