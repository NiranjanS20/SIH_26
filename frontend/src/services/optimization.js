import { optimized, baseline } from '../data/mock.js';
export async function runOptimization({onProgress}) {
  const stages=[['Checking delivery windows',18],['Balancing vehicle capacity',43],['Reducing route distance',71],['Preparing plan comparison',100]];
  for(const [label,percent] of stages){onProgress({label,percent});await new Promise(resolve=>setTimeout(resolve,430));}
  return {baseline,optimized};
}
