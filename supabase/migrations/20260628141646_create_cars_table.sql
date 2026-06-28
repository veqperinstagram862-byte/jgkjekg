-- Create cars table with all necessary fields
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  mileage INTEGER DEFAULT 0,
  fuel_type TEXT DEFAULT 'N/A',
  transmission TEXT DEFAULT 'N/A',
  engine TEXT DEFAULT 'N/A',
  color TEXT DEFAULT 'N/A',
  condition TEXT DEFAULT 'Used',
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  description TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required for this app)
CREATE POLICY "select_cars" ON cars FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "insert_cars" ON cars FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "update_cars" ON cars FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_cars" ON cars FOR DELETE
  TO anon, authenticated USING (true);

-- Create index for search
CREATE INDEX idx_cars_search ON cars (name, brand, model);
CREATE INDEX idx_cars_status ON cars (status);

-- Insert default cars
INSERT INTO cars (id, name, brand, model, year, price, mileage, fuel_type, transmission, engine, color, condition, status, description, images, featured) VALUES
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'BMW 520d',
  'BMW',
  '520d',
  2023,
  42900,
  25000,
  'Diesel',
  'Automatic',
  '2.0L TwinPower Turbo',
  'Alpine White',
  'Used',
  'available',
  'Elegant and powerful BMW 520d with xDrive all-wheel drive system. Features premium leather interior, panoramic sunroof, navigation system, and advanced driver assistance features. Excellent fuel economy combined with BMW''s legendary driving dynamics.',
  ARRAY['/images/car-1.jpg'],
  true
),
(
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  'Audi A6 Quattro',
  'Audi',
  'A6 Quattro',
  2022,
  48500,
  35000,
  'Petrol',
  'Automatic',
  '3.0L TFSI V6',
  'Mythos Black',
  'Used',
  'available',
  'Luxurious Audi A6 with legendary Quattro all-wheel drive. Premium Plus package with Matrix LED headlights, virtual cockpit, Bang & Olufsen sound system, and massage seats. Immaculate condition with full service history.',
  ARRAY['/images/car-2.jpg'],
  true
),
(
  'c3d4e5f6-a7b8-9012-cdef-345678901234',
  'Porsche Cayenne',
  'Porsche',
  'Cayenne',
  2023,
  89900,
  15000,
  'Petrol',
  'Automatic',
  '3.0L Turbo V6',
  'Carrara White',
  'Used',
  'available',
  'Stunning Porsche Cayenne with Sport Design package. Features adaptive air suspension, Sport Chrono package, premium Bose sound system, and 21-inch SportTechno wheels. Exceptional performance meets everyday practicality.',
  ARRAY['/images/car-3.jpg'],
  true
),
(
  'd4e5f6a7-b8c9-0123-def0-456789012345',
  'Range Rover Velar',
  'Range Rover',
  'Velar',
  2024,
  68500,
  5000,
  'Petrol',
  'Automatic',
  '2.0L Ingenium',
  'Santorini Black',
  'New',
  'available',
  'Brand new Range Rover Velar with striking design and advanced technology. Features sliding panoramic roof, Meridian sound system, matrix LED headlights, and Land Rover''s legendary all-terrain capability.',
  ARRAY['/images/new-1.jpg'],
  false
),
(
  'e5f6a7b8-c9d0-1234-ef01-567890123456',
  'VW Golf GTI',
  'Volkswagen',
  'Golf GTI',
  2024,
  38900,
  3000,
  'Petrol',
  'Automatic',
  '2.0L TSI',
  'Lapiz Blue',
  'New',
  'available',
  'Iconic VW Golf GTI in stunning Lapiz Blue. Features DSG transmission, Performance Pack, digital cockpit, and premium Beats audio. Perfect blend of daily practicality and driving excitement.',
  ARRAY['/images/new-2.jpg'],
  false
),
(
  'f6a7b8c9-d0e1-2345-f012-678901234567',
  'Mercedes GLE 350d',
  'Mercedes-Benz',
  'GLE 350d',
  2023,
  72000,
  20000,
  'Diesel',
  'Automatic',
  '2.9L Inline-6',
  'Obsidian Black',
  'Used',
  'available',
  'Mercedes GLE 350d 4MATIC+ with luxury features throughout. Air Body Control suspension, Burmester 3D sound, MBUX infotainment with navigation, and panoramic LED headlights. Superior comfort for long journeys.',
  ARRAY['/images/new-3.jpg'],
  false
);