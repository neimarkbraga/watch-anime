import { Fragment, PropsWithChildren, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { useStore } from 'zustand';
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
import { watchStore } from './watchStore';
import { utilsQueries } from '../../queries/utilsQueries';
import { getErrorMessage } from '../../libs/utils/getErrorMessage';
import { watchItemQueries } from '../../queries/watchItemQueries';

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
	const [videoUrl, setVideoUrl] = useState<string>('');
	const [episode, setEpisode] = useState<number>(1);

	const item = useStore(watchStore, (s) => s.items.find((i) => i.id === s.activeItemId) ?? null);
	const getItems = useStore(watchStore, (s) => s.getItems);
	const setItems = useStore(watchStore, (s) => s.setItems);

	const id = item?.id ?? '';
	const { key: updateItemKey, fn: updateItemFn } = watchItemQueries.updateWatchItem({ id });
	const updateItemMutation = useMutation(updateItemKey, updateItemFn);

	const loadContentMutation = useMutation(
		async (url: string) => {
			return utilsQueries.getHtmlContent({ url }).fn();
		},
		{
			onSuccess: (data) => {
				const dummy = document.createElement('div');
				dummy.innerHTML = data;
				const iframe = dummy.querySelector('iframe#playerframe');

				let _url = iframe?.getAttribute('src');
				if (_url && !/^http/.test(_url)) _url = 'https://ww4.gogoanime2.org' + _url;
				if (_url) setVideoUrl(_url);
			}
		}
	);

	const sourceUrl = useMemo(() => {
		if (!item?.code) return null;
		return `https://ww4.gogoanime2.org/watch/${item.code}/${episode}`;
	}, [item?.code, episode]);

	const updateEpisode = (value: number) => {
		setEpisode(value);
		if (item) {
			const updatedItem = { ...item, lastSeenEpisode: value };
			updateItemMutation.mutate({ data: updatedItem });
			setItems(getItems().map((v) => (v.id === item?.id ? updatedItem : v)));
		}
	};

	useLayoutEffect(() => {
		updateEpisode(item?.lastSeenEpisode ?? 1);
	}, [item?.id]);

	useLayoutEffect(() => {
		if (sourceUrl) {
			loadContentMutation.mutate(sourceUrl);
			setVideoUrl('');
		}
	}, [sourceUrl]);

	return (
		<Container maxWidth={false} sx={{ pt: 3 }}>
			{(() => {
				if (!item) return <Fragment />;
				return (
					<Box>
						<Stack direction="row" alignItems="center" spacing={2}>
							<Typography variant="h4" color="primary">
								{item.title}
							</Typography>
							<Typography fontSize="small" color="text.secondary">
								{item.code}
							</Typography>
						</Stack>
						{!!item.description && (
							<Typography color="text.secondary">{item.description}</Typography>
						)}
						<Box pt={2}>
							<Box width="100%" maxWidth="1200px">
								<Stack spacing={1}>
									<Box sx={{ overflow: 'auto' }}>
										{!!sourceUrl && (
											<Box sx={{ whiteSpace: 'nowrap' }}>
												Source Url:{' '}
												<Link target="_blank" href={sourceUrl}>
													{sourceUrl}
												</Link>
											</Box>
										)}
										{!!videoUrl && (
											<Box sx={{ whiteSpace: 'nowrap' }}>
												Video Url:{' '}
												<Link target="_blank" href={videoUrl}>
													{videoUrl}
												</Link>
											</Box>
										)}
									</Box>
									{(() => {
										if (loadContentMutation.isLoading)
											return (
												<PlayerWrapper>
													<Skeleton variant="rounded" width="100%" height="100%" />
												</PlayerWrapper>
											);

										if (loadContentMutation.error)
											return (
												<Alert severity="error" onClose={() => loadContentMutation.reset()}>
													{getErrorMessage(loadContentMutation.error)}
												</Alert>
											);
										if (videoUrl) return <VideoPlayer key={videoUrl} src={videoUrl} />;
									})()}
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
								</Stack>
							</Box>
						</Box>
					</Box>
				);
			})()}
		</Container>
	);
};
