/********************************************************************************
 * Copyright (C) 2020 Ericsson and others.
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

import { injectable, inject, postConstruct } from 'inversify';
import { Event, Emitter } from '@theia/core/lib/common/event';
import { DebugSessionManager } from './debug-session-manager';
import { TabBarDecorator } from '@theia/core/lib/browser/shell/tab-bar-decorator';
import { Title, Widget } from '@theia/core/lib/browser';
import { WidgetDecoration } from '@theia/core/lib/browser/widget-decoration';
import { DisposableCollection } from '@theia/core/lib/common/disposable';

@injectable()
export class DebugTabBarDecorator implements TabBarDecorator {

    readonly id = 'theia-debug-tabbar-decorator';
    protected readonly emitter = new Emitter<void>();

    private readonly toDispose = new DisposableCollection();

    @inject(DebugSessionManager)
    protected readonly debugSessionManager: DebugSessionManager;

    @postConstruct()
    protected init(): void {
        this.toDispose.pushAll([this.debugSessionManager.onDidStartDebugSession(() => this.fireDidChangeDecorations()),
        this.debugSessionManager.onDidStopDebugSession(() => this.fireDidChangeDecorations())]);
    }

    decorate(title: Title<Widget>): WidgetDecoration.Data[] {
        if (title.owner.id === 'debug') {
            const sessionCount = this.debugSessionManager.sessions.length;

            console.log(`${sessionCount} debug sesssions running...`);

            return sessionCount > 0 ? [{ badge: sessionCount }] : [];
        } else {
            return [];
        }
    }

    get onDidChangeDecorations(): Event<void> {
        return this.emitter.event;
    }

    protected fireDidChangeDecorations(): void {
        this.emitter.fire(undefined);
    }
}
