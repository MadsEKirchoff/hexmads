import { error } from '@sveltejs/kit'
import { put, list } from '@vercel/blob'
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private'

export function load({ params }) {
}