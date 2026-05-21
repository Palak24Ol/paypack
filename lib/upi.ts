export function generateUPILink({
  upiId,
  name,
  amount,
  note,
}: {
  upiId: string
  name: string
  amount: number
  note?: string
}) {
  const base = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`
  return note ? `${base}&tn=${encodeURIComponent(note)}` : base
}

export function generateWhatsAppMessage({
  name,
  amount,
  upiId,
  groupName,
}: {
  name: string
  amount: number
  upiId: string
  groupName: string
}) {
  const upiLink = generateUPILink({ upiId, name, amount, note: `PayPack - ${groupName}` })
  return `Hey ${name}! You owe ₹${amount} for *${groupName}*. Pay here 👇\n${upiLink}`
}