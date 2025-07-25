// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useMemo} from 'react';
import type {ComponentProps} from 'react';
import {FormattedMessage} from 'react-intl';

import {SyncIcon} from '@mattermost/compass-icons/components';

import Timestamp, {RelativeRanges} from 'components/timestamp';
import Tag from 'components/widgets/tag/tag';
import WithTooltip from 'components/with_tooltip';

import './panel_header.scss';
import {isToday} from 'utils/datetime';

const TIMESTAMP_PROPS: Partial<ComponentProps<typeof Timestamp>> = {
    day: 'numeric',
    useSemanticOutput: false,
    useTime: false,
    units: ['now', 'minute', 'hour', 'day', 'week', 'month', 'year'],
};

export const SCHEDULED_POST_TIME_RANGES = [
    RelativeRanges.TODAY_TITLE_CASE,
    RelativeRanges.YESTERDAY_TITLE_CASE,
    RelativeRanges.TOMORROW_TITLE_CASE,
];

export const scheduledPostTimeFormat: ComponentProps<typeof Timestamp>['useTime'] = (_, {hour, minute}) => ({hour, minute});

type Props = {
    kind: 'draft' | 'scheduledPost';
    actions: React.ReactNode;
    timestamp: number;
    remote: boolean;
    title: React.ReactNode;
    error?: string;
};

function PanelHeader({
    kind,
    actions,
    timestamp,
    remote,
    title,
    error,
}: Props) {
    const timestampDateObject = useMemo(() => new Date(timestamp), [timestamp]);

    return (
        <div className='PanelHeader'>
            <div className='PanelHeader__left'>{title}</div>
            <div className='PanelHeader__right'>
                <div className='PanelHeader__actions'>
                    {actions}
                </div>
                <div className='PanelHeader__info'>
                    {remote && (
                        <div className='PanelHeader__sync-icon'>
                            <WithTooltip
                                title={
                                    <FormattedMessage
                                        id='drafts.info.sync'
                                        defaultMessage='Updated from another device'
                                    />
                                }
                            >
                                <SyncIcon size={18}/>
                            </WithTooltip>
                        </div>
                    )}
                    <div className='PanelHeader__timestamp'>
                        {
                            Boolean(timestamp) && kind === 'draft' && (
                                <Timestamp
                                    value={new Date(timestamp)}
                                    {...TIMESTAMP_PROPS}
                                />
                            )
                        }

                        {
                            Boolean(timestamp) && kind === 'scheduledPost' && (
                                <FormattedMessage
                                    id='scheduled_post.panel.header.time'
                                    defaultMessage='Send {isTodayOrTomorrow, select, true {} other {on}} {scheduledDateTime}'
                                    values={{
                                        scheduledDateTime: (
                                            <Timestamp
                                                value={timestamp}
                                                ranges={SCHEDULED_POST_TIME_RANGES}
                                                useSemanticOutput={false}
                                                useTime={scheduledPostTimeFormat}
                                            />
                                        ),
                                        isTodayOrTomorrow: isToday(timestampDateObject),
                                    }}
                                />
                            )
                        }
                    </div>

                    {kind === 'draft' && !error && (
                        <Tag
                            variant={'danger'}
                            uppercase={true}
                            text={'draft'}
                        />
                    )}
                    {error && (
                        <Tag
                            text={error}
                            variant={'danger'}
                            uppercase={true}
                            icon={'alert-outline'}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default PanelHeader;
