import { ChatAnthropic } from '@langchain/anthropic';

const anthropicModel = new ChatAnthropic({
    model: 'claude-haiku-4-5',
    apiKey: process.env.ANTHROPIC_API_KEY
});

export default anthropicModel;