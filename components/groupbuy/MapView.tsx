'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { GroupOrder } from '@/types'
import { formatCO2, calculateCO2Saved } from '@/lib/co2'

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], 14)
  }, [lat, lng])
  return null
}

interface Props {
  orders: GroupOrder[]
  joined: string[]
  onJoin: (order: GroupOrder) => void
  userLocation: { lat: number; lng: number } | null
}

export default function MapView({ orders, joined, onJoin, userLocation }: Props) {
  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [26.8467, 80.9462]

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={13}
      style={{ height: '400px', width: '100%', borderRadius: '16px' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <>
          <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />
          <Marker position={[userLocation.lat, userLocation.lng]} icon={blueIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold text-blue-600">📍 You are here</p>
              </div>
            </Popup>
          </Marker>
        </>
      )}

      {orders.map((order) => (
        <Marker
          key={order.id}
          position={[order.lat, order.lng]}
          icon={greenIcon}
        >
          <Popup>
            <div className="text-sm space-y-1 min-w-[180px]">
              <p className="font-bold text-gray-800">{order.item}</p>
              <p className="text-gray-500 text-xs">{order.seller}</p>
              <p className="text-green-600 text-xs">{order.members}/{order.max_members} joined</p>
              <p className="text-green-600 text-xs">🌿 {formatCO2(calculateCO2Saved(order.members))} CO₂ saved</p>
              <p className="text-green-600 text-xs font-medium">Save ₹{order.delivery_saving} delivery</p>
              {!joined.includes(order.id) && order.members < order.max_members ? (
                <button
                  onClick={() => onJoin(order)}
                  style={{
                    marginTop: '8px',
                    width: '100%',
                    background: '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Join Group
                </button>
              ) : joined.includes(order.id) ? (
                <p style={{ color: '#22c55e', fontWeight: '600', fontSize: '12px', textAlign: 'center', marginTop: '6px' }}>
                  ✓ Joined!
                </p>
              ) : (
                <p style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center', marginTop: '6px' }}>
                  Group Full
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}