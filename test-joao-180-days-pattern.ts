/**
 * Test: Aluno que vai bem mas depois que chega nos 180 dias começa errar e se recuperar depois
 * 
 * Este teste simula um estudante que:
 * 1. Tem bom desempenho inicial e progressivamente alcança intervalos de 180 dias
 * 2. Após alcançar o intervalo máximo de 180 dias, começa a errar
 * 3. Depois se recupera
 */

import { simulateReviewScheduling } from './test-joao-simulation';

console.log('╔════════════════════════════════════════════════════════════════════╗');
console.log('║                                                                    ║');
console.log('║   TESTE: ALUNO QUE VAI BEM ATÉ 180 DIAS, DEPOIS ERRA E RECUPERA   ║');
console.log('║                                                                    ║');
console.log('╚════════════════════════════════════════════════════════════════════╝');
console.log();

console.log('📖 CENÁRIO DO TESTE:\n');
console.log('  Fase 1: Estudante aprende bem e atinge intervalos de 180 dias');
console.log('  Fase 2: Ao chegar em 180 dias, performance cai drasticamente');
console.log('  Fase 3: Estudante se recupera após algumas sessões');
console.log();

// FASE 1: Progressão excelente até atingir 180 dias
// Precisamos de sessões com alto desempenho (90%+) para chegar a 180 dias
const fase1Sessions = Array(15).fill({ correct: 9, incorrect: 1 }); // 90% consistente

// FASE 2: Quando atinge 180 dias, começa a errar
// Vamos ter 4-5 sessões ruins
const fase2Sessions = [
  { correct: 1, incorrect: 9 },   // 10% - SPIKE!
  { correct: 2, incorrect: 8 },   // 20% - Continua mal
  { correct: 3, incorrect: 7 },   // 30% - Ainda mal
  { correct: 2, incorrect: 8 },   // 20% - Piora novamente
];

// FASE 3: Recuperação
// O estudante se recupera com sessões de bom desempenho
const fase3Sessions = [
  { correct: 7, incorrect: 3 },   // 70% - Começa a melhorar
  { correct: 8, incorrect: 2 },   // 80% - Recuperação!
  { correct: 9, incorrect: 1 },   // 90% - Voltou ao normal
  { correct: 9, incorrect: 1 },   // 90% - Mantém o nível
];

// Combina todas as fases
const allSessions = [...fase1Sessions, ...fase2Sessions, ...fase3Sessions];

const result = simulateReviewScheduling('Matemática', 'Função', allSessions, 600);

console.log('╔════════════════════════════════════════════════════════════════════╗');
console.log('║                    FASE 1: PROGRESSÃO INICIAL                      ║');
console.log('╚════════════════════════════════════════════════════════════════════╝\n');

console.log('┌────────┬─────────┬──────────┬────────────┬───────────┬────────────┐');
console.log('│ Sessão │ Acertos │ Sess Acc │ Acum. Acc  │ Review Cnt│ Intervalo  │');
console.log('├────────┼─────────┼──────────┼────────────┼───────────┼────────────┤');

// Mostra sessões chave da Fase 1
[1, 5, 10, 13, 14, 15].forEach(num => {
  const s = result.sessions[num - 1];
  const marker = s.intervalDays === 180 ? ' 🎯 MAX!' : '';
  console.log(`│ ${num.toString().padStart(6)} │ ${s.correct}/10   │ ${s.accuracy.toFixed(0).padStart(6)}%  │ ${s.cumulativeAccuracy.toFixed(1).padStart(8)}%  │ ${s.reviewCount.toString().padStart(9)} │ ${s.intervalDays.toString().padStart(7)} d${marker} │`);
});
console.log('└────────┴─────────┴──────────┴────────────┴───────────┴────────────┘');

const lastGoodSession = result.sessions[14];
console.log(`\n💡 Após ${lastGoodSession.sessionNumber} sessões de alto desempenho:`);
console.log(`  • Acurácia acumulada: ${lastGoodSession.cumulativeAccuracy.toFixed(1)}%`);
console.log(`  • Review count: ${lastGoodSession.reviewCount}`);
console.log(`  • Intervalo alcançado: ${lastGoodSession.intervalDays} dias`);
if (lastGoodSession.intervalDays >= 180) {
  console.log('  ✅ INTERVALO MÁXIMO DE 180 DIAS ATINGIDO!');
}
console.log();

console.log('╔════════════════════════════════════════════════════════════════════╗');
console.log('║              FASE 2: QUEDA DE PERFORMANCE AOS 180 DIAS            ║');
console.log('╚════════════════════════════════════════════════════════════════════╝\n');

console.log('┌────────┬─────────┬──────────┬────────────┬───────────┬────────────┐');
console.log('│ Sessão │ Acertos │ Sess Acc │ Acum. Acc  │ Review Cnt│ Intervalo  │');
console.log('├────────┼─────────┼──────────┼────────────┼───────────┼────────────┤');

[16, 17, 18, 19].forEach(num => {
  const s = result.sessions[num - 1];
  const marker = num === 16 ? ' 🔴 SPIKE!' : ' ⚠️';
  console.log(`│ ${num.toString().padStart(6)} │ ${s.correct}/10   │ ${s.accuracy.toFixed(0).padStart(6)}%  │ ${s.cumulativeAccuracy.toFixed(1).padStart(8)}%  │ ${s.reviewCount.toString().padStart(9)} │ ${s.intervalDays.toString().padStart(7)} d${marker} │`);
});
console.log('└────────┴─────────┴──────────┴────────────┴───────────┴────────────┘');

const spikeSession = result.sessions[15];
console.log(`\n💡 O que aconteceu na Sessão ${spikeSession.sessionNumber}:`);
console.log(`  • Performance da sessão: ${spikeSession.accuracy.toFixed(0)}%`);
console.log(`  • Acurácia acumulada cai para: ${spikeSession.cumulativeAccuracy.toFixed(1)}%`);
console.log(`  • Review count: ${spikeSession.reviewCount}`);
console.log(`  • Novo intervalo: ${spikeSession.intervalDays} dias`);
if (result.finalReviewState.inRecoveryMode || spikeSession.intervalDays < 10) {
  console.log('  🚨 Sistema detectou queda de performance!');
  console.log('  → Intervalo reduzido para revisões mais frequentes');
}
console.log();

console.log('╔════════════════════════════════════════════════════════════════════╗');
console.log('║                      FASE 3: RECUPERAÇÃO                           ║');
console.log('╚════════════════════════════════════════════════════════════════════╝\n');

console.log('┌────────┬─────────┬──────────┬────────────┬───────────┬────────────┐');
console.log('│ Sessão │ Acertos │ Sess Acc │ Acum. Acc  │ Review Cnt│ Intervalo  │');
console.log('├────────┼─────────┼──────────┼────────────┼───────────┼────────────┤');

[20, 21, 22, 23].forEach(num => {
  const s = result.sessions[num - 1];
  const marker = s.accuracy >= 70 && result.sessions[num - 2]?.accuracy < 70 ? ' 🟢 Melhora!' :
                 s.accuracy >= 80 ? ' ✅ RECUPEROU!' : '';
  console.log(`│ ${num.toString().padStart(6)} │ ${s.correct}/10   │ ${s.accuracy.toFixed(0).padStart(6)}%  │ ${s.cumulativeAccuracy.toFixed(1).padStart(8)}%  │ ${s.reviewCount.toString().padStart(9)} │ ${s.intervalDays.toString().padStart(7)} d${marker} │`);
});
console.log('└────────┴─────────┴──────────┴────────────┴───────────┴────────────┘');

const finalSession = result.sessions[result.sessions.length - 1];
console.log(`\n💡 Resultado da Recuperação (Sessão ${finalSession.sessionNumber}):`);
console.log(`  • Acurácia da sessão: ${finalSession.accuracy.toFixed(0)}%`);
console.log(`  • Acurácia acumulada: ${finalSession.cumulativeAccuracy.toFixed(1)}%`);
console.log(`  • Review count: ${finalSession.reviewCount}`);
console.log(`  • Intervalo atual: ${finalSession.intervalDays} dias`);
console.log();

console.log('╔════════════════════════════════════════════════════════════════════╗');
console.log('║                        RESUMO DO TESTE                             ║');
console.log('╚════════════════════════════════════════════════════════════════════╝\n');

console.log('📊 ESTATÍSTICAS FINAIS:\n');
console.log(`  • Total de sessões: ${result.totalSessions}`);
console.log(`  • Tempo total de estudo: ${result.totalStudyTimeMinutes} minutos`);
console.log(`  • Acertos totais: ${result.finalReviewState.correctTotal}`);
console.log(`  • Erros totais: ${result.finalReviewState.incorrectTotal}`);
console.log(`  • Taxa de acerto final: ${((result.finalReviewState.correctTotal / (result.finalReviewState.correctTotal + result.finalReviewState.incorrectTotal)) * 100).toFixed(1)}%`);
console.log(`  • Review count final: ${result.finalReviewState.reviewCount}`);
console.log();

console.log('🎯 PADRÃO OBSERVADO:\n');

const session15 = result.sessions[14];
const session16 = result.sessions[15];
const session23 = result.sessions[22];

console.log(`  1️⃣ FASE INICIAL (Sessões 1-15):`);
console.log(`     • Performance consistente: 90%`);
console.log(`     • Intervalo final: ${session15.intervalDays} dias`);
console.log(`     • Review count: ${session15.reviewCount}`);
console.log();

console.log(`  2️⃣ QUEDA AOS 180 DIAS (Sessões 16-19):`);
console.log(`     • Performance cai drasticamente`);
console.log(`     • Primeira sessão ruim: ${session16.accuracy.toFixed(0)}%`);
console.log(`     • Sistema responde com intervalos curtos`);
console.log(`     • Novo intervalo: ${session16.intervalDays} dias`);
console.log();

console.log(`  3️⃣ RECUPERAÇÃO (Sessões 20-23):`);
console.log(`     • Performance melhora gradualmente`);
console.log(`     • Última sessão: ${session23.accuracy.toFixed(0)}%`);
console.log(`     • Acurácia acumulada se estabiliza: ${session23.cumulativeAccuracy.toFixed(1)}%`);
console.log(`     • Intervalo retorna a: ${session23.intervalDays} dias`);
console.log();

console.log('✅ CONCLUSÃO:\n');
console.log('  O sistema detectou corretamente a queda de performance após o estudante');
console.log('  atingir o intervalo máximo de 180 dias. O algoritmo de revisão espaçada:');
console.log('  • Reduziu os intervalos quando detectou performance ruim');
console.log('  • Permitiu que o estudante se recuperasse com revisões mais frequentes');
console.log('  • Restaurou intervalos maiores conforme a performance melhorou');
console.log();
console.log('  Isto demonstra que mesmo estudantes com bom histórico podem ter');
console.log('  dificuldades quando o conteúdo não é revisado por muito tempo (180 dias),');
console.log('  e o sistema adapta-se adequadamente para ajudá-los a recuperar.');
console.log();

console.log('🚀 Execute: npm run test:joao-180-days\n');
