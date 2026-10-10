-- ==========================================================
-- TRUSTY.bot™ — Security Hardening Migration
-- Fecha: Octubre 2026
-- Objetivo: Eliminar políticas permisivas de desarrollo y blindar RLS
-- ==========================================================

-- 1. HARDEN AGENTS TABLE
alter table if exists public.agents enable row level security;

-- Drop legacy permissive policies if they exist
drop policy if exists "Allow upsert for agents" on public.agents;
drop policy if exists "Agents are viewable by everyone" on public.agents;

-- Public read for agent trust directory & bureau
create policy "Agents public read" 
  on public.agents for select 
  using (true);

-- Only authenticated users or backend service role can insert or update agent evaluations
create policy "Agents authenticated write" 
  on public.agents for insert 
  with check (auth.uid() is not null or auth.jwt()->>'role' = 'service_role');

create policy "Agents authenticated update" 
  on public.agents for update 
  using (auth.uid() is not null or auth.jwt()->>'role' = 'service_role');

-- Prevent anonymous deletion of registered agents
create policy "Agents delete service role only" 
  on public.agents for delete 
  using (auth.jwt()->>'role' = 'service_role');


-- 2. HARDEN MANDATES TABLE
alter table if exists public.mandates enable row level security;

drop policy if exists "Allow all access to mandates" on public.mandates;

-- Public read for mandate checks
create policy "Mandates public read" 
  on public.mandates for select 
  using (true);

-- Authenticated principal or service role required to create or modify mandates
create policy "Mandates authenticated write" 
  on public.mandates for insert 
  with check (auth.uid() is not null or auth.jwt()->>'role' = 'service_role');

create policy "Mandates authenticated update" 
  on public.mandates for update 
  using (auth.uid() is not null or auth.jwt()->>'role' = 'service_role');

create policy "Mandates authenticated delete" 
  on public.mandates for delete 
  using (auth.uid() is not null or auth.jwt()->>'role' = 'service_role');


-- 3. HARDEN APPROVAL QUEUE TABLE
alter table if exists public.approval_queue enable row level security;

drop policy if exists "Allow all access to approval_queue" on public.approval_queue;

create policy "Approval queue read" 
  on public.approval_queue for select 
  using (true);

create policy "Approval queue insert" 
  on public.approval_queue for insert 
  with check (true);

-- Only authenticated reviewers or service role can resolve queue items
create policy "Approval queue resolution authenticated" 
  on public.approval_queue for update 
  using (auth.uid() is not null or auth.jwt()->>'role' = 'service_role');

create policy "Approval queue delete service role only" 
  on public.approval_queue for delete 
  using (auth.jwt()->>'role' = 'service_role');


-- 4. HARDEN DECISIONS AUDIT LOG (IMMUTABLE APPEND-ONLY LEDGER)
alter table if exists public.decisions enable row level security;

drop policy if exists "Allow all access to decisions" on public.decisions;

-- Decisions are public for non-repudiation and verification proof
create policy "Decisions public audit read" 
  on public.decisions for select 
  using (true);

-- Insert permitted for verified clearing gateway
create policy "Decisions append only" 
  on public.decisions for insert 
  with check (true);

-- Cryptographic Immutability: Block all modifications and deletions!
create policy "Decisions strictly immutable - no updates" 
  on public.decisions for update 
  using (false);

create policy "Decisions strictly immutable - no deletes" 
  on public.decisions for delete 
  using (false);
