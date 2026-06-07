-- =============================================================
-- VOIXT MPHATSO — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- =============================================================

-- Ticket orders
CREATE TABLE ticket_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  ticket_type TEXT NOT NULL CHECK (ticket_type IN ('standard', 'vip')),
  quantity INTEGER NOT NULL DEFAULT 1,
  amount DECIMAL(10,2) NOT NULL,
  transaction_id TEXT,
  payment_proof_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'checked_in')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT
);

-- Individual tickets (generated on approval)
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  qr_code_url TEXT,
  order_id UUID REFERENCES ticket_orders(id) ON DELETE CASCADE,
  attendee_name TEXT NOT NULL,
  ticket_type TEXT NOT NULL,
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ,
  checked_in_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket number sequence
CREATE SEQUENCE ticket_sequence START 1;

-- Admin content (CMS)
CREATE TABLE cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Ticket pricing
CREATE TABLE ticket_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_type TEXT UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Seed CMS content
INSERT INTO cms_content (key, value) VALUES
  ('mphatso_description', 'A story of identity, faith, and belonging — MPHATSO is VOIXT''s debut album, a deeply personal and spiritually rich collection of music that speaks to the soul of every Zambian.'),
  ('mphatso_vision', 'To create music that speaks to the soul of every Zambian, pointing hearts to faith and purpose.'),
  ('voixt_bio', 'VOIXT is a six-member gospel and contemporary music group from Zambia, united by a shared calling to glorify God through excellence in music and ministry.'),
  ('voixt_mission', 'To glorify God through excellence in music and ministry.'),
  ('voixt_vision', 'To be a voice of hope and faith across Africa and beyond.'),
  ('warren_bio', 'Warren is a founding member of VOIXT with a powerful tenor voice and a heart for worship.'),
  ('nduva_bio', 'Nduva brings a rich vocal texture to the group with soulful depth and precision.'),
  ('joash_bio', 'Joash is the energetic heartbeat of VOIXT, full of passion and warmth in every performance.'),
  ('nana_bio', 'Nana (Ruth) leads with warmth and precision, anchoring the group with grace.'),
  ('twaambo_bio', 'Twaambo (Tiwa) adds depth and harmony to every song, weaving melodies that uplift.'),
  ('lusyomo_bio', 'Lusyomo rounds out the ensemble with a powerful bass tone and unwavering musicality.');

-- Seed ticket pricing
INSERT INTO ticket_pricing (ticket_type, price, description) VALUES
  ('standard', 150.00, 'General Admission — Full concert access'),
  ('vip', 350.00, 'VIP — Priority seating + exclusive experience');

-- RLS Policies
ALTER TABLE ticket_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create orders" ON ticket_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin reads orders" ON ticket_orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin updates orders" ON ticket_orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Public reads pricing" ON ticket_pricing FOR SELECT USING (true);
CREATE POLICY "Public reads cms" ON cms_content FOR SELECT USING (true);
CREATE POLICY "Admin updates cms" ON cms_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin reads tickets" ON tickets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin creates tickets" ON tickets FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin updates tickets" ON tickets FOR UPDATE USING (auth.role() = 'authenticated');

-- Helper function for ticket sequence (used by the app)
CREATE OR REPLACE FUNCTION nextval(seq_name TEXT)
RETURNS BIGINT AS $$
BEGIN
  RETURN nextval(seq_name::regclass);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
