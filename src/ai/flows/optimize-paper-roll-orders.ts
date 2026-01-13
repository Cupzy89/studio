'use server';

/**
 * @fileOverview An AI tool that suggests optimized orders for paper rolls.
 *
 * - optimizePaperRollOrders - A function that suggests optimized orders for paper rolls.
 * - OptimizePaperRollOrdersInput - The input type for the optimizePaperRollOrders function.
 * - OptimizePaperRollOrdersOutput - The return type for the optimizePaperRollOrders function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizePaperRollOrdersInputSchema = z.object({
  historicalUsage: z
    .array(
      z.object({
        rollType: z.string(),
        quantity: z.number(),
        date: z.string().datetime(),
      })
    )
    .describe('Historical usage data for each paper roll type.'),
  currentStockLevels: z
    .array(
      z.object({
        rollType: z.string(),
        quantity: z.number(),
      })
    )
    .describe('Current stock levels for each paper roll type.'),
  supplierLeadTimes: z
    .array(
      z.object({
        rollType: z.string(),
        supplier: z.string(),
        leadTimeDays: z.number(),
        costPerRoll: z.number(),
      })
    )
    .describe(
      'Supplier lead times (in days) and cost per roll for each paper roll type.'
    ),
  desiredStockLevels: z
    .array(
      z.object({
        rollType: z.string(),
        quantity: z.number(),
      })
    )
    .describe('The desired stock levels for each roll type.'),
});
export type OptimizePaperRollOrdersInput = z.infer<typeof OptimizePaperRollOrdersInputSchema>;

const OptimizePaperRollOrdersOutputSchema = z.array(
  z.object({
    rollType: z.string().describe('The type of paper roll to order.'),
    supplier: z.string().describe('The suggested supplier for the order.'),
    quantity: z.number().describe('The quantity of paper rolls to order.'),
    estimatedDeliveryDate: z
      .string()
      .datetime()
      .describe('The estimated delivery date for the order.'),
    cost: z.number().describe('The estimated cost of the order.'),
  })
);
export type OptimizePaperRollOrdersOutput = z.infer<typeof OptimizePaperRollOrdersOutputSchema>;

export async function optimizePaperRollOrders(
  input: OptimizePaperRollOrdersInput
): Promise<OptimizePaperRollOrdersOutput> {
  return optimizePaperRollOrdersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizePaperRollOrdersPrompt',
  input: {schema: OptimizePaperRollOrdersInputSchema},
  output: {schema: OptimizePaperRollOrdersOutputSchema},
  prompt: `You are an AI assistant helping a production manager optimize paper roll orders.

  Analyze the historical usage, current stock levels, supplier lead times, desired stock levels and suggest optimized orders for various paper rolls.

  Consider the following factors:
  - Minimize the risk of stockouts.
  - Optimize inventory costs.
  - Factor in supplier lead times.

  Historical Usage:
  {{#each historicalUsage}}
  - Roll Type: {{rollType}}, Quantity: {{quantity}}, Date: {{date}}
  {{/each}}

  Current Stock Levels:
  {{#each currentStockLevels}}
  - Roll Type: {{rollType}}, Quantity: {{quantity}}
  {{/each}}

  Supplier Lead Times and Costs:
  {{#each supplierLeadTimes}}
  - Roll Type: {{rollType}}, Supplier: {{supplier}}, Lead Time (Days): {{leadTimeDays}}, Cost Per Roll: {{costPerRoll}}
  {{/each}}

  Desired Stock Levels:
  {{#each desiredStockLevels}}
  - Roll Type: {{rollType}}, Quantity: {{quantity}}
  {{/each}}

  Suggest orders in JSON format:
  `,
});

const optimizePaperRollOrdersFlow = ai.defineFlow(
  {
    name: 'optimizePaperRollOrdersFlow',
    inputSchema: OptimizePaperRollOrdersInputSchema,
    outputSchema: OptimizePaperRollOrdersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
