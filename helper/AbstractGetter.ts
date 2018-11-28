import { HttpStatusCode, IHttp } from '@rocket.chat/apps-engine/definition/accessors';

import { AbstractResult } from '../helper/AbstractResult';

export class AbstractGetter {
    private readonly url = 'http://api.duckduckgo.com/?format=json&q=';

    public async empty(): Promise<AbstractResult> {
      const result = new AbstractResult();
      result.successful = false;
      result.content = `You must enter a term to search!`;
      return result;
    }

    public async search(http: IHttp, term: string): Promise<AbstractResult> {

        const response = await http.get(`${this.url}${term}`);
        const result = new AbstractResult();

        let url;
        let content;

        if (response.statusCode === HttpStatusCode.OK && response.content) {
            const responseBody = response.content;
            const textResponse = JSON.parse(responseBody);
            if (!textResponse) {
              result.successful = false;
              result.content = `Error parsing data!`;
              return result;
            } else {
              result.successful = true;
              let topic;
              if (textResponse.RelatedTopics && textResponse.RelatedTopics.length) {
                topic = textResponse.RelatedTopics[0];
              }
              if (textResponse.AbstractText) {
                content = textResponse.AbstractText as string;
                if (textResponse.AbstractURL) {
                  url = textResponse.AbstractURL as string;
                  result.content = url + `\n` + content;
                } else {
                  result.content = content;
                }
              } else if (topic && !/\/c\//.test(topic.FirstURL)) {
                content = topic.Text as string;
                url = topic.FirstURL as string;
                result.content = url + `\n` + content;
              } else if (textResponse.Definition) {
                content = textResponse.Definition as string;
                if (textResponse.DefinitionURL) {
                  url = textResponse.DefinitionURL as string;
                  result.content = url + `\n` + content;
                } else {
                  result.content = content;
                }
              } else {
                result.successful = false;
                result.content = `I don't know anything about that.`;
              }
            }
        } else {
            result.successful = false;
            result.content = `Couldn't find anything on that.`;
        }

        return result;
    }
}
