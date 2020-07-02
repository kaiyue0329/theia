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

import { injectable, postConstruct } from 'inversify';
import { Event, Emitter } from '../common/event';
import { Title, Widget } from '@phosphor/widgets';
import { TabBarDecorator } from './shell/tab-bar-decorator';
import { WidgetDecoration } from './widget-decoration';
import { Navigatable } from './navigatable'; // add Preference change event later

@injectable()
export class WidgetTabBarDecorator implements TabBarDecorator {

    readonly id = 'theia-widget-tabbar-decorator';

    protected readonly emitter = new Emitter<void>();

    // add inject

    @postConstruct()
    protected init(): void {
        // add event change listener
        // this.problemManager.onDidChangeMarkers(() => this.fireDidChangeDecorations());
        // add preference for badge
        // this.preferences.onPreferenceChanged(event => this.handlePreferenceChange(event));
    }

    decorate(title: Title<Widget>): WidgetDecoration.Data[] {
        const widget = title.owner;
        if (Navigatable.is(widget)) {
            const resourceUri = widget.getResourceUri();
            if (resourceUri) {

                // get the badge value from contributions!!
                // test code
                const badgeValue = 123;

                // Decorate the tabbar with a dynamically changing badge number if available.
                return badgeValue ? [{ badge: badgeValue }] : [];
            }
        }
        return [];
    }

    get onDidChangeDecorations(): Event<void> {
        return this.emitter.event;
    }

    protected fireDidChangeDecorations(): void {
        this.emitter.fire(undefined);
    }

    /**
     * Handle changes in preference later.
     * @param {PreferenceChangeEvent<ProblemConfiguration>} event The event of the changes in preference.
     */

}
