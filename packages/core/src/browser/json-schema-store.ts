/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { injectable, inject, named } from 'inversify';
import { ContributionProvider } from '../common/contribution-provider';
import { FrontendApplicationContribution } from './frontend-application';

export interface JsonSchemaConfiguration {
    fileMatch: string | string[];
    url: string;
}

export const JsonSchemaContribution = Symbol('JsonSchemaContribution');
export interface JsonSchemaContribution {
    registerSchemas(store: JsonSchemaStore): void
}

@injectable()
export class JsonSchemaStore implements FrontendApplicationContribution {

    @inject(ContributionProvider) @named(JsonSchemaContribution)
    protected readonly contributions: ContributionProvider<JsonSchemaContribution>;

    private readonly schemas: JsonSchemaConfiguration[] = [];

    onStart(): void {
        for (const contribution of this.contributions.getContributions()) {
            contribution.registerSchemas(this);
        }
    }

    /**
     * Clients should implement `JsonSchemaContribution` to call these method,
     * otherwise schemas won't be applied.
     */
    registerSchema(config: JsonSchemaConfiguration): void {
        this.schemas.push(config);
    }

    getJsonSchemaConfigurations(): JsonSchemaConfiguration[] {
        return [...this.schemas];
    }

}
