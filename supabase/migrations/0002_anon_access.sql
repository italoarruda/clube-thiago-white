-- Políticas de acesso para o role anon (desenvolvimento local sem autenticação)
-- Permite que o cliente Supabase com chave pública acesse todas as tabelas

DO $$
DECLARE
  tabelas TEXT[] := ARRAY[
    'unidades', 'classes', 'especialidades', 'desbravadores',
    'desbravador_especialidades', 'mensalidades', 'caixa_transacoes',
    'custos', 'patrimonio', 'atas', 'atos'
  ];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY tabelas LOOP
    EXECUTE format('CREATE POLICY "anon_select_%s" ON %I FOR SELECT TO anon USING (true)', t, t);
    EXECUTE format('CREATE POLICY "anon_insert_%s" ON %I FOR INSERT TO anon WITH CHECK (true)', t, t);
    EXECUTE format('CREATE POLICY "anon_update_%s" ON %I FOR UPDATE TO anon USING (true)', t, t);
    EXECUTE format('CREATE POLICY "anon_delete_%s" ON %I FOR DELETE TO anon USING (true)', t, t);
  END LOOP;
END $$;
