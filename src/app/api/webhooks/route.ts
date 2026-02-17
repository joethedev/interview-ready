import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    const eventType = evt.type
    const userId = evt.data.id as string

    console.log(`📥 Webhook received: ${eventType} for user ${userId}`)

    // Handle user.created event
    if (eventType === 'user.created') {
      const firstName = evt.data.first_name as string | null
      const lastName = evt.data.last_name as string | null
      const fullName = [firstName, lastName].filter(Boolean).join(' ') || null
      const isPremium = false

      const { error } = await supabase
        .from('profiles')
        .insert({
          clerk_user_id: userId,
          full_name: fullName,
          is_premium: isPremium,
        })

      if (error) {
        console.error('❌ Error creating profile:', error)
        return new Response('Error creating profile', { status: 500 })
      }

      console.log('✅ Profile created for user:', userId)
    }

    // Handle user.updated event
    if (eventType === 'user.updated') {
      const firstName = evt.data.first_name as string | null
      const lastName = evt.data.last_name as string | null
      const fullName = [firstName, lastName].filter(Boolean).join(' ') || null
      const isPremium = false

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          is_premium: isPremium,
        })
        .eq('clerk_user_id', userId)

      if (error) {
        console.error('❌ Error updating profile:', error)
        return new Response('Error updating profile', { status: 500 })
      }

      console.log('✅ Profile updated for user:', userId)
    }

    // Handle user.deleted event
    if (eventType === 'user.deleted') {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('clerk_user_id', userId)

      if (error) {
        console.error('❌ Error deleting profile:', error)
        return new Response('Error deleting profile', { status: 500 })
      }

      console.log('✅ Profile deleted for user:', userId)
    }

    return new Response('Webhook processed successfully', { status: 200 })
  } catch (err) {
    console.error('❌ Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}