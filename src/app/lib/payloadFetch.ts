export async function fetchPayloadCollection(collection: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/${collection}`);
  if (!res.ok) throw new Error('Failed to fetch collection');
  const data = await res.json();
  return data;
}