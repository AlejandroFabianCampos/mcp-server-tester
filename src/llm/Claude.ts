import { Anthropic } from '@anthropic-ai/sdk';
import { ToolDefinition } from '../types';

/**
 * Wrapper around the Anthropic SDK for generating natural language queries.
 */
export class Claude {
  private anthropic: Anthropic;
  private model: string = process.env.CLAUDE_MODEL || 'claude-3-7-sonnet-20250219';

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
  }

  /**
   * Generate a natural language query describing a call to the given tool.
   * @param tool Tool definition to generate a query for
   */
  async generateNaturalLanguageQuery(tool: ToolDefinition): Promise<string> {
    const prompt = `You are a user who wants to call the following tool. Provide a single sentence describing the request in natural language.\n\nName: ${tool.name}\nDescription: ${tool.description}\nParameters: ${JSON.stringify(tool.inputSchema?.properties ?? {}, null, 2)}`;

    try {

      const response = await this.anthropic.messages.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt
          },
        ],
        max_tokens: 100,
        temperature: 0.7
      });


      if (response.content[0].type === 'text') {
        return response.content[0].text.trim();
      } else {
        return '';
      }
    } catch (err) {
      console.error('Failed to generate natural language query:', err);
      return '';
    }
  }
}
