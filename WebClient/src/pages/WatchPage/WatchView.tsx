import { Fragment, PropsWithChildren, useMemo, useRef } from 'react';
import { useMutation, useQuery } from 'react-query';
import {
	Alert,
	Box,
	Button,
	Container,
	Link,
	MenuItem,
	Select,
	Skeleton,
	Stack,
	Typography
} from '@mui/material';
import { useWatchStore } from './useWatchStore';
import { utilsQueries } from '../../queries/utilsQueries';
import { getErrorMessage } from '../../libs/utils/getErrorMessage';
import { watchItemQueries } from '../../queries/watchItemQueries';
import { useWatchPageContext } from './WatchPageContext';
import { WatchItemMenu } from './WatchItemMenu';

const PlayerWrapper = (props: PropsWithChildren) => {
	const { children } = props;
	return <Box sx={{ width: '100%', height: '360px' }}>{children}</Box>;
	// return (
	// 	<Box sx={{ position: 'relative', width: '100%', paddingTop: '45%' }}>
	// 		<Box sx={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>{children}</Box>
	// 	</Box>
	// );
};

const VideoPlayer = (props: { src: string }) => {
	const { src } = props;
	const ref = useRef<HTMLIFrameElement>(null);

	return (
		<PlayerWrapper>
			<iframe
				ref={ref}
				key={src}
				title={src}
				src={src}
				style={{ height: '100%', width: '100%', borderWidth: 0, border: 'none' }}
				loading="lazy"
				allowFullScreen
			/>
		</PlayerWrapper>
	);
};

export const WatchView = () => {
	const { watchId } = useWatchPageContext();

	const item = useWatchStore((s) => s.items.find((i) => i.id === watchId) ?? null);
	const getItems = useWatchStore((s) => s.getItems);
	const setItems = useWatchStore((s) => s.setItems);

	const id = item?.id ?? '';
	const code = item?.code ?? '';
	const episode = item?.lastSeenEpisode ?? 1;
	const sourceOrigin = 'https://ww4.gogoanime2.org';

	const { key: updateItemKey, fn: updateItemFn } = watchItemQueries.updateWatchItem({ id });
	const updateItemMutation = useMutation(updateItemKey, updateItemFn);

	const sourceUrl = useMemo(() => {
		return code ? `${sourceOrigin}/watch/${code}/${episode}` : null;
	}, [code, episode]);

	const { key: getHtmlKey, fn: getHtmlFn } = utilsQueries.getHtmlContent({ url: sourceUrl ?? '' });
	const getHtmlQuery = useQuery(getHtmlKey, getHtmlFn, {
		cacheTime: Infinity,
		staleTime: Infinity
	});

	const videoUrl = useMemo(() => {
		const dummy = document.createElement('div');
		dummy.innerHTML = getHtmlQuery.data ?? '';

		const iframe = dummy.querySelector('iframe#playerframe');
		const src = iframe?.getAttribute('src') ?? '';

		return src.startsWith('/') ? sourceOrigin + src : src;
	}, [getHtmlQuery.data]);

	const updateEpisode = (value: number) => {
		if (item) {
			const updatedItem = { ...item, lastSeenEpisode: value };
			setItems(getItems().map((v) => (v.id === item.id ? updatedItem : v)));
			updateItemMutation.mutate({ data: updatedItem });
		}
	};

	return (
		<Container maxWidth={false} sx={{ py: 2 }}>
			{(() => {
				if (!item) return <Fragment />;
				return (
					<Box>
						<Stack direction="row" alignItems="center" spacing={0.5}>
							<Typography variant="h4" color="primary">
								{item.title}
							</Typography>
							<Box flex={1} />
							<WatchItemMenu watchItem={item} />
						</Stack>
						<Typography fontSize="small" color="text.secondary">
							{item.code}
						</Typography>

						{!!item.description && (
							<Typography color="text.secondary">{item.description}</Typography>
						)}
						<Box pt={2}>
							<Box width="100%" maxWidth="1200px">
								<Stack spacing={1}>
									{(() => {
										if (getHtmlQuery.isLoading)
											return (
												<PlayerWrapper>
													<Skeleton variant="rounded" width="100%" height="100%" />
												</PlayerWrapper>
											);

										if (getHtmlQuery.error)
											return (
												<Alert severity="error" onClose={() => getHtmlQuery.refetch()}>
													{getErrorMessage(getHtmlQuery.error)}
												</Alert>
											);

										if (videoUrl) return <VideoPlayer key={videoUrl} src={videoUrl} />;
									})()}

									{!!videoUrl && !getHtmlQuery.error && (
										<Stack direction="row" spacing={2}>
											<Button
												variant="outlined"
												disabled={episode <= 1}
												onClick={() => updateEpisode(episode - 1)}
											>
												Prev
											</Button>
											<Box flex={1}>
												<Select
													value={episode}
													onChange={(e) => updateEpisode(Number(e.target.value))}
													fullWidth
													size="small"
												>
													{Array.from(new Array(episode + 100)).map((n, index) => (
														<MenuItem key={index} value={index + 1}>
															Episode {index + 1}
														</MenuItem>
													))}
												</Select>
											</Box>
											<Button variant="outlined" onClick={() => updateEpisode(episode + 1)}>
												Next
											</Button>
										</Stack>
									)}

									<Box sx={{ overflow: 'auto', textAlign: 'center' }}>
										{!!sourceUrl && (
											<Box sx={{ whiteSpace: 'nowrap' }}>
												Source Url:&nbsp;
												<Link target="_blank" href={sourceUrl}>
													{sourceUrl}
												</Link>
											</Box>
										)}
										{!!videoUrl && !getHtmlQuery.error && (
											<Box sx={{ whiteSpace: 'nowrap' }}>
												Video Url:&nbsp;
												<Link target="_blank" href={videoUrl}>
													{videoUrl}
												</Link>
											</Box>
										)}
									</Box>
								</Stack>
							</Box>
						</Box>
					</Box>
				);
			})()}
		</Container>
	);
};
