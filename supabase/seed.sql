-- Users table
create table users (
  id uuid default gen_random_uuid() primary key,
  clerk_id text unique not null,
  name text not null,
  email text not null,
  upi_id text,
  owned_methods text[] default '{}',
  created_at timestamptz default now()
);

-- Groups table
create table groups (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_by text not null,
  members text[] default '{}',
  created_at timestamptz default now()
);

-- Expenses table
create table expenses (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references groups(id) on delete cascade,
  description text not null,
  amount numeric not null,
  paid_by text not null,
  category text not null,
  split_between text[] default '{}',
  created_at timestamptz default now()
);

-- Offers table
create table offers (
  id uuid default gen_random_uuid() primary key,
  method text not null,
  category text not null,
  platforms text[] default '{}',
  cashback_pct float default 0,
  max_cashback int,
  min_amount int default 0,
  type text not null,
  scratch_card boolean default false,
  note text,
  updated_at timestamptz default now()
);

-- Group orders table (for green group buy)
create table group_orders (
  id uuid default gen_random_uuid() primary key,
  seller text not null,
  item text not null,
  lat float not null,
  lng float not null,
  members int default 1,
  max_members int default 5,
  delivery_saving numeric default 0,
  created_at timestamptz default now()
);

insert into offers (method, category, platforms, cashback_pct, max_cashback, min_amount, type, note) values
-- PhonePe
('PhonePe UPI', 'food', '{"Swiggy","Zomato"}', 10, 50, 100, 'upi_wallet', 'Scratch card on every order'),
('PhonePe UPI', 'grocery', '{"Blinkit","Zepto","BigBasket"}', 5, 40, 200, 'upi_wallet', 'Flat cashback on grocery orders'),
('PhonePe UPI', 'travel', '{"IRCTC","RedBus","MakeMyTrip"}', 5, 100, 500, 'upi_wallet', 'On bus and train bookings'),
('PhonePe UPI', 'utility', '{"Electricity","Gas","Water"}', 2, 30, 100, 'upi_wallet', 'On bill payments'),
('PhonePe UPI', 'shopping', '{"Flipkart"}', 5, 75, 300, 'upi_wallet', 'PhonePe on Flipkart orders'),

-- Google Pay
('Google Pay', 'food', '{"Swiggy","Zomato"}', 10, 50, 100, 'upi_wallet', 'Scratch card rewards'),
('Google Pay', 'utility', '{"Electricity","Gas","Water","DTH"}', 3, 30, 100, 'upi_wallet', 'Bill payment cashback'),
('Google Pay', 'shopping', '{"Flipkart","Myntra"}', 5, 50, 200, 'upi_wallet', 'Google Pay offers on checkout'),
('Google Pay', 'grocery', '{"BigBasket","Blinkit"}', 5, 40, 150, 'upi_wallet', 'Grocery cashback'),

-- Paytm
('Paytm UPI', 'food', '{"Swiggy","Zomato","Paytm Food"}', 15, 75, 100, 'upi_wallet', 'Paytm cashback on food orders'),
('Paytm UPI', 'travel', '{"IRCTC","RedBus","Paytm Travel"}', 10, 150, 500, 'upi_wallet', 'Travel booking cashback'),
('Paytm UPI', 'utility', '{"Electricity","Gas","DTH","Mobile"}', 5, 50, 100, 'upi_wallet', 'Utility bill cashback'),
('Paytm UPI', 'shopping', '{"Amazon","Flipkart"}', 5, 60, 200, 'upi_wallet', 'Shopping cashback'),
('Paytm UPI', 'grocery', '{"BigBasket","Grofers"}', 8, 60, 200, 'upi_wallet', 'Grocery cashback'),

-- Amazon Pay
('Amazon Pay UPI', 'shopping', '{"Amazon"}', 5, 150, 200, 'upi_wallet', '5% back on Amazon orders'),
('Amazon Pay UPI', 'food', '{"Swiggy"}', 10, 75, 100, 'upi_wallet', 'Amazon Pay on Swiggy'),
('Amazon Pay UPI', 'utility', '{"Electricity","Gas"}', 3, 50, 100, 'upi_wallet', 'Bill payment cashback'),
('Amazon Pay UPI', 'grocery', '{"BigBasket"}', 5, 60, 200, 'upi_wallet', 'Amazon Pay grocery cashback'),

-- HDFC Millennia Credit Card
('HDFC Millennia Card', 'shopping', '{"Amazon","Flipkart","Myntra","Tata CLiQ"}', 5, 1000, 2000, 'credit_card', '5% cashback on partner sites'),
('HDFC Millennia Card', 'food', '{"Swiggy","Zomato"}', 5, 1000, 2000, 'credit_card', '5% on food delivery apps'),
('HDFC Millennia Card', 'travel', '{"Uber"}', 5, 1000, 2000, 'credit_card', '5% on Uber rides'),
('HDFC Millennia Card', 'grocery', '{"BigBasket","Blinkit"}', 5, 1000, 2000, 'credit_card', '5% on online grocery'),
('HDFC Millennia Card', 'offline', '{"All stores"}', 1, null, 100, 'credit_card', '1% on all offline spends'),

-- Axis Ace Credit Card
('Axis Ace Card', 'utility', '{"Google Pay Bills","Electricity","Gas"}', 5, null, 0, 'credit_card', 'Best card for bill payments'),
('Axis Ace Card', 'food', '{"Swiggy","Zomato"}', 4, null, 0, 'credit_card', '4% on food delivery'),
('Axis Ace Card', 'travel', '{"Ola","Uber"}', 4, null, 0, 'credit_card', '4% on cab rides'),
('Axis Ace Card', 'shopping', '{"All online"}', 2, null, 0, 'credit_card', '2% on all online spends'),

-- ICICI Amazon Pay Card
('ICICI Amazon Pay Card', 'shopping', '{"Amazon"}', 5, null, 0, 'credit_card', '5% on Amazon for Prime members'),
('ICICI Amazon Pay Card', 'food', '{"Swiggy","Zomato"}', 2, null, 0, 'credit_card', '2% on food delivery'),
('ICICI Amazon Pay Card', 'shopping', '{"All online"}', 2, null, 0, 'credit_card', '2% on all online shopping'),

-- SBI Cashback Card
('SBI Cashback Card', 'shopping', '{"All online"}', 5, null, 0, 'credit_card', '5% on all online transactions'),
('SBI Cashback Card', 'offline', '{"All stores"}', 1, null, 0, 'credit_card', '1% on offline spends'),

-- BHIM UPI
('BHIM UPI', 'utility', '{"Electricity","Gas","Water"}', 1, 25, 100, 'upi_wallet', 'Govt cashback on bill payments'),
('BHIM UPI', 'shopping', '{"All merchants"}', 1, 25, 100, 'upi_wallet', 'Base UPI cashback');

insert into offers (method, category, platforms, cashback_pct, max_cashback, min_amount, type, note) values

-- CRED Pay
('CRED Pay', 'food', '{"Swiggy","Zomato","EatSure"}', 10, 100, 200, 'upi_wallet', 'CRED coins + partner cashback'),
('CRED Pay', 'travel', '{"MakeMyTrip","Ola","Uber"}', 8, 200, 500, 'upi_wallet', 'Travel offers for CRED members'),
('CRED Pay', 'shopping', '{"Myntra","Nykaa","Ajio"}', 10, 150, 300, 'upi_wallet', 'Exclusive CRED member offers'),
('CRED Pay', 'utility', '{"Electricity","Gas","DTH"}', 5, 50, 100, 'upi_wallet', 'Bill payment CRED coins'),
('CRED Pay', 'grocery', '{"BigBasket","Zepto"}', 8, 80, 200, 'upi_wallet', 'Grocery cashback for members'),

-- Jupiter Edge+ Card
('Jupiter Edge+ Card', 'shopping', '{"All online"}', 5, null, 0, 'credit_card', '5% cashback on all online spends'),
('Jupiter Edge+ Card', 'food', '{"Swiggy","Zomato"}', 5, null, 0, 'credit_card', '5% on food delivery'),
('Jupiter Edge+ Card', 'grocery', '{"BigBasket","Blinkit","Zepto"}', 5, null, 0, 'credit_card', '5% on online grocery'),
('Jupiter Edge+ Card', 'offline', '{"All stores"}', 2, null, 0, 'credit_card', '2% on offline spends'),
('Jupiter Edge+ Card', 'utility', '{"Electricity","Gas","Water"}', 2, null, 0, 'credit_card', '2% on utility bills'),

-- Kiwi RuPay Credit Card (UPI-linked)
('Kiwi RuPay Card', 'food', '{"Swiggy","Zomato"}', 5, 100, 100, 'upi_credit', 'UPI credit card on food'),
('Kiwi RuPay Card', 'grocery', '{"BigBasket","Blinkit","Zepto"}', 5, 100, 100, 'upi_credit', 'UPI credit card on grocery'),
('Kiwi RuPay Card', 'shopping', '{"All online"}', 3, 150, 200, 'upi_credit', 'UPI credit card online'),
('Kiwi RuPay Card', 'utility', '{"Electricity","Gas","DTH"}', 3, 75, 100, 'upi_credit', 'Bill payments via UPI'),
('Kiwi RuPay Card', 'offline', '{"All UPI merchants"}', 1, 50, 50, 'upi_credit', '1% on all UPI offline spends'),

-- HDFC UPI RuPay Credit Card
('HDFC RuPay Credit Card', 'grocery', '{"Supermarkets","BigBasket"}', 3, 500, 100, 'upi_credit', 'UPI credit card grocery'),
('HDFC RuPay Credit Card', 'dining', '{"Restaurants","Zomato"}', 3, 500, 100, 'upi_credit', 'Dining cashback via UPI'),
('HDFC RuPay Credit Card', 'utility', '{"Electricity","Gas","Water"}', 2, 500, 100, 'upi_credit', 'Utility bill cashback'),
('HDFC RuPay Credit Card', 'travel', '{"IRCTC","Bus","Metro"}', 3, 500, 200, 'upi_credit', 'Travel cashback via UPI'),
('HDFC RuPay Credit Card', 'shopping', '{"All UPI merchants"}', 2, 500, 200, 'upi_credit', '2% on all UPI purchases'),

-- Slice Card
('Slice Card', 'food', '{"Swiggy","Zomato","EatSure"}', 5, 100, 100, 'credit_card', 'Slice cashback on food'),
('Slice Card', 'shopping', '{"Amazon","Flipkart","Myntra"}', 3, 200, 200, 'credit_card', 'Slice shopping cashback'),
('Slice Card', 'grocery', '{"BigBasket","Blinkit","Zepto"}', 3, 100, 150, 'credit_card', 'Grocery cashback'),
('Slice Card', 'travel', '{"Uber","Ola","Rapido"}', 5, 100, 100, 'credit_card', 'Cab ride cashback'),
('Slice Card', 'entertainment', '{"Bookmyshow","PVR","INOX"}', 10, 100, 200, 'credit_card', 'Movie ticket cashback'),

-- Airtel Payments Bank UPI
('Airtel Payments Bank', 'utility', '{"Airtel Recharge","Electricity","Gas"}', 5, 50, 100, 'upi_wallet', 'Cashback on Airtel recharge'),
('Airtel Payments Bank', 'food', '{"Swiggy","Zomato"}', 5, 40, 100, 'upi_wallet', 'Food delivery cashback'),
('Airtel Payments Bank', 'shopping', '{"Amazon","Flipkart"}', 3, 50, 200, 'upi_wallet', 'Shopping cashback'),

-- Paytm Wallet (separate from UPI)
('Paytm Wallet', 'entertainment', '{"Bookmyshow","PVR","INOX"}', 10, 100, 200, 'upi_wallet', 'Movie ticket cashback'),
('Paytm Wallet', 'travel', '{"Paytm Travel","IRCTC","RedBus"}', 8, 150, 300, 'upi_wallet', 'Travel booking offers'),
('Paytm Wallet', 'grocery', '{"Paytm Mall","BigBasket"}', 5, 60, 200, 'upi_wallet', 'Grocery cashback'),

-- ICICI Sapphiro Card
('ICICI Sapphiro Card', 'travel', '{"MakeMyTrip","Yatra","IRCTC"}', 0, null, 0, 'credit_card', '4 reward points per ₹100'),
('ICICI Sapphiro Card', 'shopping', '{"All online"}', 0, null, 0, 'credit_card', '4 reward points per ₹100'),
('ICICI Sapphiro Card', 'dining', '{"Restaurants","Zomato"}', 0, null, 0, 'credit_card', '4X reward points on dining'),

-- YES Bank UPI
('YES Pay UPI', 'utility', '{"Electricity","Gas","Water","DTH"}', 3, 30, 100, 'upi_wallet', 'YES Bank bill payment cashback'),
('YES Pay UPI', 'shopping', '{"All merchants"}', 2, 30, 200, 'upi_wallet', 'General UPI cashback');

insert into offers (method, category, platforms, cashback_pct, max_cashback, min_amount, type, note) values

-- Flipkart Axis Bank Credit Card
('Flipkart Axis Card', 'shopping', '{"Flipkart","Myntra","Cleartrip"}', 5, null, 0, 'credit_card', '5% on Flipkart ecosystem'),
('Flipkart Axis Card', 'food', '{"Swiggy"}', 4, null, 0, 'credit_card', '4% on Swiggy orders'),
('Flipkart Axis Card', 'travel', '{"Cleartrip","Uber"}', 4, null, 0, 'credit_card', '4% on travel bookings'),
('Flipkart Axis Card', 'offline', '{"All stores"}', 1.5, null, 0, 'credit_card', '1.5% on all offline spends'),
('Flipkart Axis Card', 'grocery', '{"BigBasket","Blinkit"}', 4, null, 200, 'credit_card', '4% on grocery delivery'),

-- IDFC First Wealth Card
('IDFC First Wealth Card', 'dining', '{"All restaurants"}', 6, null, 0, 'credit_card', '6X rewards on dining'),
('IDFC First Wealth Card', 'travel', '{"All airlines","MakeMyTrip"}', 6, null, 0, 'credit_card', '6X rewards on travel'),
('IDFC First Wealth Card', 'shopping', '{"All online"}', 3, null, 0, 'credit_card', '3X rewards on online shopping'),
('IDFC First Wealth Card', 'utility', '{"Electricity","Gas","Water"}', 3, null, 100, 'credit_card', '3X rewards on utilities'),
('IDFC First Wealth Card', 'offline', '{"All stores"}', 3, null, 0, 'credit_card', '3X rewards on all offline'),

-- Mobikwik ZIP
('MobiKwik ZIP', 'food', '{"Swiggy","Zomato","FreshMenu"}', 12, 80, 100, 'upi_wallet', 'SuperCash on food orders'),
('MobiKwik ZIP', 'grocery', '{"BigBasket","Zepto","Blinkit"}', 8, 60, 150, 'upi_wallet', 'SuperCash on grocery'),
('MobiKwik ZIP', 'utility', '{"Electricity","Gas","DTH","Mobile"}', 5, 40, 100, 'upi_wallet', 'SuperCash on bill payments'),
('MobiKwik ZIP', 'shopping', '{"Ajio","Myntra","Nykaa"}', 6, 75, 200, 'upi_wallet', 'SuperCash on fashion'),
('MobiKwik ZIP', 'entertainment', '{"Bookmyshow","PVR"}', 10, 80, 150, 'upi_wallet', 'Movie SuperCash'),

-- Tata Neu HDFC Card
('Tata Neu HDFC Card', 'shopping', '{"Tata CLiQ","BigBasket","Croma"}', 5, null, 0, 'credit_card', '5% NeuCoins on Tata brands'),
('Tata Neu HDFC Card', 'food', '{"Starbucks","Qmin"}', 5, null, 0, 'credit_card', '5% NeuCoins on Tata food'),
('Tata Neu HDFC Card', 'travel', '{"Air Asia","Tata AIG"}', 5, null, 500, 'credit_card', '5% NeuCoins on travel'),
('Tata Neu HDFC Card', 'grocery', '{"BigBasket","StarBazaar"}', 5, null, 200, 'credit_card', '5% NeuCoins on grocery'),
('Tata Neu HDFC Card', 'offline', '{"All Tata stores"}', 1.5, null, 0, 'credit_card', '1.5% NeuCoins offline'),

-- FamPay (teens UPI)
('FamPay', 'food', '{"Swiggy","Zomato","McDonald s"}', 8, 50, 50, 'upi_wallet', 'FamCoins on food orders'),
('FamPay', 'entertainment', '{"Bookmyshow","PVR","INOX"}', 10, 60, 100, 'upi_wallet', 'FamCoins on movies'),
('FamPay', 'shopping', '{"Amazon","Flipkart","Myntra"}', 5, 50, 100, 'upi_wallet', 'FamCoins on shopping'),

-- Navi UPI
('Navi UPI', 'food', '{"Swiggy","Zomato"}', 5, 40, 100, 'upi_wallet', 'Cashback on food orders'),
('Navi UPI', 'grocery', '{"Blinkit","Zepto","BigBasket"}', 5, 40, 150, 'upi_wallet', 'Grocery cashback'),
('Navi UPI', 'shopping', '{"Amazon","Flipkart"}', 3, 50, 200, 'upi_wallet', 'Shopping cashback'),

-- SBI YONO
('SBI YONO Pay', 'utility', '{"Electricity","Gas","Water","DTH"}', 2, 30, 100, 'upi_wallet', 'YONO cashback on bills'),
('SBI YONO Pay', 'shopping', '{"Amazon","Flipkart"}', 2, 30, 200, 'upi_wallet', 'YONO shopping cashback'),
('SBI YONO Pay', 'travel', '{"IRCTC","RedBus"}', 3, 50, 300, 'upi_wallet', 'YONO travel cashback'),

-- Kotak 811
('Kotak 811 UPI', 'food', '{"Swiggy","Zomato"}', 5, 40, 100, 'upi_wallet', 'Cashback on food delivery'),
('Kotak 811 UPI', 'shopping', '{"All merchants"}', 2, 30, 200, 'upi_wallet', 'General shopping cashback');